import { NoopLogger } from '@ukri-tfs/logging';
import { AuthorizationProviderStub } from './authorizationProviderStub';

const stubLogger = new NoopLogger();

describe('packages/lambda-handler tfsServiceClient/authorization', () => {
    describe('StubAuthorizationProvider', () => {
        const uut = new AuthorizationProviderStub(stubLogger);

        it('can be constructed', () => {
            expect(uut).toBeDefined;
        });

        it('returns an empty Authorization', async () => {
            await expect(uut.getAuthorization()).resolves.toEqual('');
        });
    });
});
