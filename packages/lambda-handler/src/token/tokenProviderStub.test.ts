import { describe, expect, it } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { TokenProviderStub } from './tokenProviderStub';

const stubLogger = new NoopLogger();

describe('packages/lambda-handler - oauth/tokenProviderStub', () => {
    it('can be constructed', () => {
        expect(new TokenProviderStub(stubLogger)).toBeDefined;
    });

    it('returns the empty token', async () => {
        const uut = new TokenProviderStub(stubLogger);

        await expect(uut.getToken()).resolves.toBe('');
    });
});
