import { describe, expect, it } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { TokenProviderPreset } from './tokenProviderPreset';

const stubLogger = new NoopLogger();

describe('packages/lambda-handler - oauth/tokenProviderPreset', () => {
    it('can be constructed', () => {
        expect(new TokenProviderPreset('some-token', stubLogger)).toBeDefined;
    });

    it('returns the given token', async () => {
        const uut = new TokenProviderPreset('some-token', stubLogger);

        await expect(uut.getToken()).resolves.toBe('some-token');
    });
});
