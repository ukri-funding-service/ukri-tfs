import { type Logger } from '@ukri-tfs/logging';
import { type ClientCredentialsFlow } from '../oauth/clientCredentialsFlow';
import { type TokenProvider } from './tokenProvider';

export class TokenProviderClientCredentials implements TokenProvider {
    constructor(
        private readonly clientCredentialsFlow: ClientCredentialsFlow,
        private readonly scope: string,
        private readonly logger: Logger,
    ) {}

    async getToken(): Promise<string> {
        this.logger.debug(`TokenProviderClientCredentials requesting access token for scope ${this.scope}`);
        const tokenResponse = await this.clientCredentialsFlow.getAccessToken(this.scope);

        return tokenResponse.access_token;
    }
}
