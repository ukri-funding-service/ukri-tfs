import { SecretProvider } from '@ukri-tfs/secrets';
import { ClientCredentialsFlow } from './clientCredentialsFlow';
import { AccessTokenResponse, dumpRedactedToken, isAccessTokenResponse } from './accessToken';
import { Logger } from '@ukri-tfs/logging';
import { default as fetch, Response } from 'node-fetch';
import { type ClientCredentialsServerConfig } from './clientCredentialsServerConfig';

export const dumpClientCredentialsServerConfig = (config: ClientCredentialsServerConfig): string => {
    return `Server URL: ${config.clientCredentialsUrl}, client id:${config.clientCredentialsId}, secret name:${config.clientCredentialsSecretName}`;
};

export class ClientCredentialsFlowFetchImpl implements ClientCredentialsFlow {
    constructor(
        private readonly config: ClientCredentialsServerConfig,
        private readonly secretProvider: SecretProvider,
        private readonly logger: Logger,
        private readonly fetchImpl: typeof fetch = fetch,
    ) {}

    async getAccessToken(scope: string): Promise<AccessTokenResponse> {
        this.logger.debug(`getAccessToken - config [${dumpClientCredentialsServerConfig(this.config)}]`);

        const uri = `${this.config.clientCredentialsUrl}/oauth2/token`;

        let base64EncodedSecret;

        try {
            this.logger.debug('Looking up client credentials secret using secretProvider');
            const secret = await this.secretProvider.getSecret(this.config.clientCredentialsSecretName);
            base64EncodedSecret = Buffer.from(`${this.config.clientCredentialsId}:${secret}`).toString('base64');
        } catch (error) {
            const message = getErrorMessageFrom(error);
            this.logger.warn(`Error retrieving secret from SecretProvider: ${message}`);
            throw error;
        }

        const opts = {
            method: 'post',
            body: `grant_type=client_credentials&scope=${scope}`,
            headers: {
                authorization: `Basic ${base64EncodedSecret}`,
                'content-type': 'application/x-www-form-urlencoded',
            },
        };

        let oauthResponse: Response;

        try {
            this.logger.debug('Retrieving access token');
            oauthResponse = await this.fetchImpl(uri, opts);

            if (!oauthResponse.ok) {
                throw new Error(`OAuth server rejected request with status ${oauthResponse.status}`);
            }
        } catch (error) {
            const message = getErrorMessageFrom(error);
            this.logger.warn(`Error getting access token from OAuth server:  ${message}`);
            throw error;
        }

        let json;

        try {
            this.logger.debug('Reading access token from response');
            json = await oauthResponse.json();
        } catch (error) {
            const message = getErrorMessageFrom(error);
            this.logger.warn(`Error getting access token from OAuth server:  ${message}`);
            throw error;
        }

        if (!isAccessTokenResponse(json)) {
            this.logger.debug('Rejecting OAuth clientCredentials response as it is not valid: no access_token found');
            throw new Error('Unexpected response from ClientCredentials token exchange, no access_token found');
        }

        this.logger.debug(`ClientCredentialsFlowFetchImpl Returning ${dumpRedactedToken(json)}`);
        return json;
    }
}

export const getErrorMessageFrom = (error: unknown): string => {
    let message;

    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = JSON.stringify(error);
    }

    return message;
};
