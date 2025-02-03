import { NoopLogger } from '@ukri-tfs/logging';
import { TokenProvider } from '../token/tokenProvider';
import { TokenProviderStub } from '../token/tokenProviderStub';
import { AuthorizationProviderBearer } from './authorizationProviderBearer';

class MockTokenProvider implements TokenProvider {
    getToken = async (): Promise<string> => Promise.resolve('mock-token-for-testing');
}

const stubLogger = new NoopLogger();
const mockTokenProvider = new MockTokenProvider();

describe('packages/lambda-handler tfsServiceClient/authorizationProviderBearer', () => {
    const uut = new AuthorizationProviderBearer(mockTokenProvider, stubLogger);

    it('can be constructed', () => {
        expect(uut).toBeDefined;
    });

    it('builds a Bearer token', async () => {
        await expect(uut.getAuthorization()).resolves.toMatch(/^Bearer .+/);
    });

    it('utilises token provider as the token source', async () => {
        await expect(uut.getAuthorization()).resolves.toEqual('Bearer mock-token-for-testing');
    });

    it('rejects if TokenProvider rejects', async () => {
        const rejectingTokenProvider: TokenProvider = {
            getToken: (): Promise<string> => Promise.reject(new Error('TEST ERROR')),
        };

        const uutWithErroringTokenProvider = new AuthorizationProviderBearer(rejectingTokenProvider, stubLogger);

        await expect(uutWithErroringTokenProvider.getAuthorization()).rejects.toThrow('TEST ERROR');
    });

    it('returns an empty Authorization if TokenProvider returns empty response', async () => {
        const uutWithStubTokenProvider = new AuthorizationProviderBearer(new TokenProviderStub(stubLogger), stubLogger);

        await expect(uutWithStubTokenProvider.getAuthorization()).resolves.toEqual('');
    });
});
