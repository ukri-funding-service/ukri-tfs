import { describe, expect, it } from '@jest/globals';
import { AccessTokenResponse, dumpRedactedToken, isAccessTokenResponse } from './accessToken';

describe('packages/lambda-handler - awsClient/token', () => {
    describe('isAccessTokenResponse', () => {
        it('is not an AccessTokenResponse if undefined', () => {
            expect(isAccessTokenResponse(undefined)).toEqual(false);
        });

        it('is not an AccessTokenResponse if empty object', () => {
            expect(isAccessTokenResponse({})).toEqual(false);
        });

        it('is not an AccessTokenResponse if object doesnt have expected property', () => {
            expect(isAccessTokenResponse({ not_valid: 'access-token' })).toEqual(false);
        });

        it('is not an AccessTokenResponse if object has expected property but its undefined', () => {
            expect(isAccessTokenResponse({ access_token: undefined })).toEqual(false);
        });

        it('is not an AccessTokenResponse if object has expected property but its undefined', () => {
            expect(isAccessTokenResponse({ access_token: null })).toEqual(false);
        });

        it('is not an AccessTokenResponse if object has expected property but its empty', () => {
            expect(isAccessTokenResponse({ access_token: '' })).toEqual(false);
        });

        it('is an AccessTokenResponse if object has expected property', () => {
            expect(isAccessTokenResponse({ access_token: 'access-token' })).toEqual(true);
        });
    });

    describe('dumpRedactedToken', () => {
        const stubAccessTokenForTesting = 'ABCDEF0123456';

        const stubToken: AccessTokenResponse = {
            access_token: stubAccessTokenForTesting,
            expires_in: 0,
            token_type: 'Bearer',
        };

        it('should not output the actual token contents', () => {
            expect(dumpRedactedToken(stubToken)).not.toMatch(/ABCDEF0123456/);
        });

        it('should output the number of chars in the token', () => {
            expect(dumpRedactedToken(stubToken)).toMatch(/token=13 chars/);
        });
    });
});
