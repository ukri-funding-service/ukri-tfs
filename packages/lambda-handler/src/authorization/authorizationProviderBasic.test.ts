import { NoopLogger } from '@ukri-tfs/logging';
import { AuthorizationProviderBasic } from './authorizationProviderBasic';
import { TokenProvider } from '../token/tokenProvider';
import { TokenProviderStub } from '../token/tokenProviderStub';

class MockTokenProvider implements TokenProvider {
    getToken = async (): Promise<string> => Promise.resolve('mock-token-for-testing');
}

const stubLogger = new NoopLogger();
const mockTokenProvider = new MockTokenProvider();

describe('packages/lambda-handler tfsServiceClient/AuthorizationProviderBasic', () => {
    const uut = new AuthorizationProviderBasic(mockTokenProvider, stubLogger);

    it('can be constructed', () => {
        expect(uut).toBeDefined;
    });

    it('builds a Bearer token', async () => {
        await expect(uut.getAuthorization()).resolves.toMatch(/^Basic .+/);
    });

    it('utilises token provider as the token source', async () => {
        await expect(uut.getAuthorization()).resolves.toEqual('Basic mock-token-for-testing');
    });

    it('rejects if TokenProvider rejects', async () => {
        const rejectingTokenProvider: TokenProvider = {
            getToken: (): Promise<string> => Promise.reject(new Error('TEST ERROR')),
        };

        const uutWithErroringTokenProvider = new AuthorizationProviderBasic(rejectingTokenProvider, stubLogger);

        await expect(uutWithErroringTokenProvider.getAuthorization()).rejects.toThrow('TEST ERROR');
    });

    it('returns an empty Authorization if TokenProvider returns empty response', async () => {
        const uutWithStubTokenProvider = new AuthorizationProviderBasic(new TokenProviderStub(stubLogger), stubLogger);

        await expect(uutWithStubTokenProvider.getAuthorization()).resolves.toEqual('');
    });
});
