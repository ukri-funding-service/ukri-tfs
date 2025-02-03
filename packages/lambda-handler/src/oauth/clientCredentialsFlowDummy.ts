/* istanbul ignore */
import { type AccessTokenResponse } from './accessToken';
import { type Logger } from '@ukri-tfs/logging';
import { type ClientCredentialsFlow } from './clientCredentialsFlow';

/**
 * A dummy ClientCredentialsFlow implementation for testing purposes.
 * This implementation MUST NOT be used in production.
 */
export class ClientCredentialsFlowDummy implements ClientCredentialsFlow {
    constructor(private readonly dangerouslyOverrideAccessToken: string, private readonly logger: Logger) {}

    async getAccessToken(_scope: string): Promise<AccessTokenResponse> {
        this.logger.warn('*** Using DANGEROUSLY OVERRIDDEN OAuth access token ***');

        return {
            access_token: this.dangerouslyOverrideAccessToken,
            expires_in: 3600,
            token_type: 'Bearer',
        };
    }
}
