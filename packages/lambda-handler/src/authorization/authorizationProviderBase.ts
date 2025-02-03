import { type Logger } from '@ukri-tfs/logging';
import { type TokenProvider } from '../token/tokenProvider';
import { type AuthorizationProvider } from './authorizationProvider';

export abstract class AuthorizationProviderBase implements AuthorizationProvider {
    constructor(readonly tokenProvider: TokenProvider, private readonly logger: Logger) {}

    /**
     * Implementers should provider an implementation which returns
     * the Authorization type prefix, eg 'Basic' or 'Bearer'
     */
    abstract getAuthorizationPrefix(): string;

    getAuthorization = async (): Promise<string> => {
        this.logger.debug(`OAuthAuthorizationProvider requesting token from TokenProvider`);
        const accessToken = await this.tokenProvider.getToken();

        if (accessToken.length > 0) {
            this.logger.debug(`Token was ${accessToken.length} characters, returning Bearer Authorization`);
            return `${this.getAuthorizationPrefix()} ${accessToken}`;
        } else {
            this.logger.debug(`Token was zero length, returning empty Authorization`);
            return '';
        }
    };
}
