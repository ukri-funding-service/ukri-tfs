import { NoopLogger } from '@ukri-tfs/logging';
import { AuthorizationProviderOAuth } from '.';
import { type TokenProvider } from '../token/tokenProvider';
import { TokenProviderStub } from '../token/tokenProviderStub';

class MockTokenProvider implements TokenProvider {
    getToken = async (): Promise<string> => Promise.resolve('mock-token-for-testing');
}

const stubLogger = new NoopLogger();
const stubTokenProvider = new MockTokenProvider();

describe('packages/lambda-handler tfsServiceClient/authorizationProviderOAuth', () => {
    const uut = new AuthorizationProviderOAuth(stubTokenProvider, 'some-scope', stubLogger);

    it('can be constructed', () => {
        expect(uut).toBeDefined;
    });

    it('utilises token provider to build Bearer token', async () => {
        await expect(uut.getAuthorization()).resolves.toEqual('Bearer mock-token-for-testing');
    });

    it('rejects if TokenProvider rejects', async () => {
        const rejectingTokenProvider: TokenProvider = {
            getToken: (): Promise<string> => Promise.reject(new Error('TEST ERROR')),
        };

        const uutWithErroringTokenProvider = new AuthorizationProviderOAuth(
            rejectingTokenProvider,
            'some-scope',
            stubLogger,
        );

        await expect(uutWithErroringTokenProvider.getAuthorization()).rejects.toThrow('TEST ERROR');
    });

    it('returns an empty Authorization if TokenProvider returns empty response', async () => {
        const uutWithStubTokenProvider = new AuthorizationProviderOAuth(
            new TokenProviderStub(stubLogger),
            'some-scope',
            stubLogger,
        );

        await expect(uutWithStubTokenProvider.getAuthorization()).resolves.toEqual('');
    });
});
