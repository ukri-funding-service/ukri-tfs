import { describe, expect, it } from '@jest/globals';
import { ClientCredentialsFlow } from '../oauth/clientCredentialsFlow';
import { AccessTokenResponse } from '../oauth/accessToken';
import { NoopLogger } from '@ukri-tfs/logging';
import { TokenProviderClientCredentials } from './tokenProviderClientCredentials';

const stubLogger = new NoopLogger();
const stubScope = 'stub-scope-for-testing';

describe('packages/lambda-handler - oauth/tokenProviderClientCredentials', () => {
    const stubAccessTokenResponse: AccessTokenResponse = {
        access_token: 'stub_access_token_for_testing',
        token_type: 'Bearer',
        expires_in: 3600,
    };

    const stubClientCredentialsFlow: ClientCredentialsFlow = {
        getAccessToken: function (): Promise<AccessTokenResponse> {
            return Promise.resolve(stubAccessTokenResponse);
        },
    };

    it('can be constructed', () => {
        expect(new TokenProviderClientCredentials(stubClientCredentialsFlow, stubScope, stubLogger)).toBeDefined;
    });

    it('gets a token', async () => {
        const uut = new TokenProviderClientCredentials(stubClientCredentialsFlow, stubScope, stubLogger);

        const result = await uut.getToken();

        expect(result).toBe('stub_access_token_for_testing');
    });
});
