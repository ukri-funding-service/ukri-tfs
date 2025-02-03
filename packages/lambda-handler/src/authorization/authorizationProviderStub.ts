import { type Logger } from '@ukri-tfs/logging';
import { type AuthorizationProvider } from './authorizationProvider';

export class AuthorizationProviderStub implements AuthorizationProvider {
    constructor(private readonly logger: Logger) {}

    getAuthorization = async (): Promise<string> => {
        this.logger.debug(`StubAuthorizationProvider returning empty Authorization`);
        return '';
    };
}
