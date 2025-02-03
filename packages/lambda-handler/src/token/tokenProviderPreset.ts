import { Logger } from '@ukri-tfs/logging';
import { TokenProvider } from './tokenProvider';

/**
 * A TokenProvider which always returns a preconfigured token.
 */
export class TokenProviderPreset implements TokenProvider {
    constructor(readonly accessToken: string, private readonly logger: Logger) {}

    async getToken(): Promise<string> {
        this.logger.debug(`getToken returning token of length ${this.accessToken.length}`);
        return this.accessToken;
    }
}
