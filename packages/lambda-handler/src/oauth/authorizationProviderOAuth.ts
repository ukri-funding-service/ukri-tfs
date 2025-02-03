import { type Logger } from '@ukri-tfs/logging';
import { type TokenProvider } from '../token/tokenProvider';

export type AuthorizationProvider = {
    getAuthorization: () => Promise<string>;
};

export class AuthorizationProviderOAuth implements AuthorizationProvider {
    constructor(readonly tokenProvider: TokenProvider, readonly scope: string, private readonly logger: Logger) {}

    getAuthorization = async (): Promise<string> => {
        this.logger.debug(`AuthorizationProviderOAuth requesting token from TokenProvider`);
        const accessToken = await this.tokenProvider.getToken();

        if (accessToken.length > 0) {
            this.logger.debug(`Token was ${accessToken.length} characters, returning Bearer Authorization`);
            return `Bearer ${accessToken}`;
        } else {
            this.logger.debug(`Token was zero length, returning empty Authorization`);
            return '';
        }
    };
}
