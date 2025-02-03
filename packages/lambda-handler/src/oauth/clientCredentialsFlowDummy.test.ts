import { describe, expect, it } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { ClientCredentialsFlowDummy } from './clientCredentialsFlowDummy';

describe('packages/lambda-handler - oauth/clientCredentialsFlowDummy', () => {
    const stubLogger = new NoopLogger();

    describe('getAccessToken', () => {
        it('returns the given token when requested', async () => {
            const uut = new ClientCredentialsFlowDummy('this is a test access token', stubLogger);

            await expect(uut.getAccessToken('stub,scope')).resolves.toEqual({
                access_token: 'this is a test access token',
                expires_in: 3600,
                token_type: 'Bearer',
            });
        });
    });
});
