import { type Logger } from '@ukri-tfs/logging';
import { type TokenProvider } from '../token/tokenProvider';
import { AuthorizationProviderBase } from './authorizationProviderBase';

export class AuthorizationProviderBearer extends AuthorizationProviderBase {
    constructor(tokenProvider: TokenProvider, logger: Logger) {
        super(tokenProvider, logger);
    }

    getAuthorizationPrefix(): string {
        return 'Bearer';
    }
}
