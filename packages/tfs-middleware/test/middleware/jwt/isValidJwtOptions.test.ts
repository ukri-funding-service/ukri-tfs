import { RequestContext, RequestWithContext } from '@ukri-tfs/auth';
import { NoopLogger } from '@ukri-tfs/logging';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage, ServerResponse } from 'http';
import 'mocha';
import { Socket } from 'net';
import { WellKnownEndpointKeysAccessor } from '../../../src';
import {
    getAccessTokenFromRequestFn,
    getClaimsFromPayload,
    getIsValidJwtOptions,
    onErrorFn,
    verifyClaimsFn,
} from '../../../src/middleware/jwt/isValidJwtOptions';
import { JwtValidationError } from '../../../src/middleware/jwt/models/jwtValidationError';
import { JwtVerificationErrors } from '../../../src/security';

describe('package/tfs-middleware - middleware/jwt/isValidJwtOptions', async () => {
    chai.use(chaiAsPromised);

    const testRequestContext: RequestContext = {
        service: 'TEST',
        correlationIds: {
            root: '123456',
            parent: '78910',
            current: '121314',
        },
        userData: { userId: 'test', user: Promise.resolve(undefined) },
        logger: new NoopLogger(),
    };

    describe('getClaimsFromPayload', () => {
        it('should return an empty string if payload is a string', () => {
            expect(getClaimsFromPayload('foo')).to.deep.equal([]);
        });

        it('should return an empty string if payload is an empty object', () => {
            expect(getClaimsFromPayload({})).to.deep.equal([]);
        });

        it("should return the value of the payload's 'scope' prop if it has one", () => {
            const claims = 'foo bar baz';
            expect(getClaimsFromPayload({ scope: claims })).to.deep.equal(['foo', 'bar', 'baz']);
        });
    });

    describe('getAccessTokenFromRequestFn', () => {
        let req: IncomingMessage;

        beforeEach(() => {
            req = new IncomingMessage(new Socket());
            (req as RequestWithContext).context = testRequestContext;
        });

        it('should return undefined if request has no Authorization header', () => {
            expect(getAccessTokenFromRequestFn(req)).to.be.undefined;
        });

        it("should return undefined if the request's Authorization header does not start with 'Bearer '", () => {
            req.headers['Authorization'] = 'test';

            expect(getAccessTokenFromRequestFn(req)).to.be.undefined;
        });

        it("should return the bearer value if the request's Authorization header starts with 'Bearer '", () => {
            req.headers['Authorization'] = 'Bearer test';

            expect(getAccessTokenFromRequestFn(req)).to.equal('test');
        });
    });

    describe('verifyClaimsFn', async () => {
        it('should throw an error given an empty set of required claims', async () => {
            const payload = '';
            const requiredClaims: string[] = [];

            return expect(verifyClaimsFn(payload, requiredClaims))
                .to.eventually.be.rejectedWith(JwtValidationError, 'No service scopes set')
                .and.to.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        it('should throw an error given a string payload', async () => {
            const payload = 'any string will fail';
            const requiredClaims = ['fail', 'fast'];

            return expect(verifyClaimsFn(payload, requiredClaims))
                .to.eventually.be.rejectedWith(
                    JwtValidationError,
                    'Token does not contain required claims. Expected: [fail,fast], actual: []',
                )
                .and.to.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        it('should throw an error given an empty object payload', async () => {
            const payload = {};
            const requiredClaims = ['fail', 'fast'];

            return expect(verifyClaimsFn(payload, requiredClaims))
                .to.eventually.be.rejectedWith(
                    JwtValidationError,
                    'Token does not contain required claims. Expected: [fail,fast], actual: []',
                )
                .and.to.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        it('should throw an error given a payload with no scope', async () => {
            const payload = { foo: 'bar' };
            const requiredClaims = ['fail', 'fast'];

            return expect(verifyClaimsFn(payload, requiredClaims))
                .to.eventually.be.rejectedWith(
                    JwtValidationError,
                    'Token does not contain required claims. Expected: [fail,fast], actual: []',
                )
                .and.to.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        it('should throw an error given a payload with no matching scope', async () => {
            const payload = { scope: 'foo bar' };
            const requiredClaims = ['fail', 'fast'];

            return expect(verifyClaimsFn(payload, requiredClaims))
                .to.eventually.be.rejectedWith(
                    JwtValidationError,
                    'Token does not contain required claims. Expected: [fail,fast], actual: [foo,bar]',
                )
                .and.to.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        it('should eventually resolve given a payload with matching scope', async () => {
            const payload = { scope: 'fail fast' };
            const requiredClaims = ['fail', 'fast'];

            return expect(verifyClaimsFn(payload, requiredClaims)).to.eventually.be.fulfilled;
        });
    });

    describe('onErrorFn', () => {
        let req: IncomingMessage;
        let res: ServerResponse;

        beforeEach(() => {
            req = new IncomingMessage(new Socket());
            (req as RequestWithContext).context = testRequestContext;
            res = new ServerResponse(req);
        });

        it('should return a 401 Unauthorized response status given an accessTokenNotFound JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.accessTokenNotFound);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(401);
        });

        it('should return a 500 Internal Server Error response status given a failedToCreatePem JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.failedToCreatePem);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(500);
        });

        it('should return a 401 Unauthorized response status given a failedToDecodeToken JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.failedToDecodeToken);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(401);
        });

        it('should return a 500 Internal Server Error response status given a failedToGetKeysFromWellKnownEndpoint JWT verification error', () => {
            const error = new JwtValidationError(
                "That didn't work",
                JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
            );
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(500);
        });

        it('should return a 403 Forbidden response status given an invalidClaims JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.invalidClaims);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(403);
        });

        it('should return a 401 Unauthorized response status given an invalidToken JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.invalidToken);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(401);
        });

        it('should return a 401 Unauthorized response status given a tokenExpired JWT verification error', () => {
            const error = new JwtValidationError("That didn't work", JwtVerificationErrors.tokenExpired);
            onErrorFn(req, res, error);
            expect(res.statusCode).to.equal(401);
        });
    });

    describe('getIsValidJwtOptions', () => {
        it('returns the expected VerifyJwtMiddlewareOptions', async () => {
            const requiredClaims = ['claim1', 'claim2'];
            const wellKnownEndpoint = 'https://example.com/.well-known/jwks.json';

            let wasCalled = 0;

            const stubKeysAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: () => {
                    wasCalled++;
                    return Promise.resolve([]);
                },
            };

            const result = getIsValidJwtOptions(requiredClaims, wellKnownEndpoint, stubKeysAccessor);

            expect(result.requiredClaims).to.deep.equal(requiredClaims);
            expect(result.rawTokenExtractor).to.deep.equal({ extract: getAccessTokenFromRequestFn });
            expect(result.claimsVerifier).to.deep.equal({ verify: verifyClaimsFn });
            expect(result.wellKnownEndpoint).to.equal(wellKnownEndpoint);
            // keyAccessor omitted as it gets wrapped in a cache decorator

            await result.keysAccessor.retrieve('something');

            // if the stub was called, the options must be using the provided function
            expect(wasCalled).to.equal(1);

            // second call should use the cached version
            const secondResult = getIsValidJwtOptions(requiredClaims, wellKnownEndpoint, stubKeysAccessor);
            await secondResult.keysAccessor.retrieve('something');
            expect(wasCalled).to.equal(1);
        });
    });
});
