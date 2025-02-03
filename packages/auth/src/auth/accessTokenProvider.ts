import fetch from 'isomorphic-unfetch';
import jwt from 'jsonwebtoken';
import { Logger } from '@ukri-tfs/logging';

export interface AccessTokenProviderOptions {
    url: string;
    clientId: string;
    clientSecret: string;
    scope: string;
}

export class AccessTokenProvider {
    constructor(private options: AccessTokenProviderOptions, private logger: Logger) {}

    private currentAccessToken = '';

    public async tokenIsExpiringOrInvalid(token: string): Promise<boolean> {
        const claims = jwt.decode(token, { complete: false, json: true });

        if (claims && claims.exp) {
            const thirtySecondsAfterNow = Date.now() / 1000 + 30;
            return claims.exp < thirtySecondsAfterNow; // expires within 30 seconds
        }

        return true; // invalid token
    }

    public async getCurrentAccessToken(): Promise<string> {
        if (
            !this.currentAccessToken ||
            this.currentAccessToken === '' ||
            (await this.tokenIsExpiringOrInvalid(this.currentAccessToken))
        ) {
            await this.refreshAccessToken();
        }
        return this.currentAccessToken;
    }

    public async refreshAccessToken(): Promise<void> {
        try {
            this.currentAccessToken = await this.getAccessToken();
        } catch (e) {
            this.logger.error(e);
        }
    }

    public async getAccessToken(): Promise<string> {
        const encodedClientDetails = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString(
            'base64',
        );

        try {
            const uri = `${this.options.url}/oauth2/token`;

            const opts = {
                method: 'post',
                body: `grant_type=client_credentials&scope=${this.options.scope}`,
                headers: {
                    authorization: `Basic ${encodedClientDetails}`,
                    'content-type': 'application/x-www-form-urlencoded',
                },
            };
            const awsResponse = await fetch(uri, opts);
            const json = await awsResponse.json();

            if (json.error) {
                return Promise.reject(json.error);
            }

            return json.access_token;
        } catch (e) {
            this.logger.error(e);
            return Promise.reject('an error occurred');
        }
    }
}

export function createAccessTokenProvider(
    logger: Logger,
    scope?: string,
    url?: string,
    clientId?: string,
    clientSecret?: string,
): AccessTokenProvider {
    const redact = (value?: string) => (value ? '(redacted)' : '(not set)');

    if (!scope || !url || !clientId || !clientSecret) {
        throw new Error(
            `createAccessTokenProvider failed for these parameters: {` +
                `scope: ${redact(scope)}, ` +
                `url: ${url}, ` +
                `clientId: ${redact(clientId)}, ` +
                `clientSecret: ${redact(clientSecret)}}`,
        );
    }

    return new AccessTokenProvider({ url, clientId, clientSecret, scope }, logger);
}
