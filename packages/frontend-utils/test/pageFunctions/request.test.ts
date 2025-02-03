import { anonymousUser, RequestContext } from '@ukri-tfs/auth';
import { expect } from 'chai';
import { IncomingMessage } from 'http';
import { getLoggedInUserIdFromRequest, getTfsUserId } from '../../src/pageFunctions';

describe('Request function tests', () => {
    describe('getLoggedInUserIdFromRequest() tests', () => {
        it('should return the anonymous user given an undefined request', () => {
            const request = undefined;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with no session', () => {
            const request = {} as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with an empty session object', () => {
            const request = { session: {} } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with an undefined userTfsId in the session', () => {
            const request = { session: { userTfsId: undefined } } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the value of the userTfsId given a request with a userTfsId in the session', () => {
            const request = {
                session: { userTfsId: 'this-is-me' },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal('this-is-me');
        });

        it('should return the anonymous user given a request with an undefined passport', () => {
            const request = {
                session: { passport: undefined },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with a passport containing an undefined user', () => {
            const request = {
                session: { passport: { user: undefined } },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with a passport containing an incomplete user', () => {
            const request = {
                session: { passport: { user: { user: undefined } } },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the anonymous user given a request with a passport containing a user in the session but no tfsId', () => {
            const request = {
                session: { passport: { user: { user: { tfsId: undefined } } } },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the value of the passport user tfsId given a request with a passport containing a user in the session', () => {
            const request = {
                session: { passport: { user: { user: { tfsId: 'this-is-me' } } } },
            } as unknown as IncomingMessage;

            const result = getLoggedInUserIdFromRequest(request);

            expect(result).to.equal('this-is-me');
        });
    });

    describe('getTfsUserId() tests', () => {
        it('should return the anonymous user given a requestContext with an undefined userId in the userContext', () => {
            const requestContext = { userData: { userId: undefined } } as RequestContext;

            const result = getTfsUserId(requestContext);

            expect(result).to.equal(anonymousUser);
        });

        it('should return the userId given a requestContext with a defined userId in the userContext', () => {
            const requestContext = { userData: { userId: 'this-is-me' } } as RequestContext;

            const result = getTfsUserId(requestContext);

            expect(result).to.equal('this-is-me');
        });
    });
});
