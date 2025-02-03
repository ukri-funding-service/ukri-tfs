/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage } from 'http';
import { Algorithm, Secret, VerifyOptions } from 'jsonwebtoken';
import 'mocha';
import { Socket } from 'net';
import sinon from 'sinon';
import 'sinon-chai';
import {
    decodeAccessToken,
    getAccessTokenFromRequest,
    getPayloadFromAccessToken,
    getPemFromDecodedToken,
    getWellKnownEndpointKeys,
} from '../../../src/middleware/jwt/jwtProviders';
import { DecodedToken, JwtValidationError, WellKnownEndpointKey } from '../../../src/middleware/jwt/models';
import { JwtVerificationErrors } from '../../../src/security';

describe('packages/tfs-middleware - middleware/jwt', () => {
    const jwt = require('jsonwebtoken');
    const jwkToPem = require('../../../src/security/jwkToPem');

    before(() => {
        chai.should();
        chai.use(chaiAsPromised);
    });

    // required to stub the jwt.verify's overloaded function with proper typings.
    // Sinon uses jwt.verify's void return type instead of the object | string that we need.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/36436
    interface Jwt {
        verify: (token: string, secretOrPublicKey: Secret, options?: VerifyOptions) => object | string;
    }

    let successfulCallSpy: sinon.SinonStub;
    let asyncExceptionCallSpy: sinon.SinonStub;
    let asyncSuccessCallSpy: sinon.SinonStub;

    const socket = new Socket();
    const req = new IncomingMessage(socket);

    const goodJwt = 'eyJraWQiOiJraWQiLCJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.5Gm4T1hXPB1Aec8WZYBPAEPgyP86hQ7EYk03sdzxFNY';
    const badJwt = 'something.otherRubbishthatismalformed.with.too.many.points';
    const throwJwt = 'usingThisTellsTheFunctionToThrow';
    const expiredJwt = 'will.throw.an.expired.jwt.error';

    const goodPem = 'goodPem';

    const goodKey = { kid: 'kid' };
    const badKey = { kid: 'bad' };
    const throwKey = { kid: 'throw' };

    const decodedAccessToken: Partial<DecodedToken> = {
        header: { kid: 'kid', alg: 'HS256' },
        payload: 'payload',
        signature: 'signature',
    };
    const decodeOptions = { complete: true, json: true };
    const alg: Algorithm = 'RS256';
    const verifyOptions = { algorithms: [alg] };

    beforeEach(() => {
        successfulCallSpy = sinon.stub().returns('Test Response');
        asyncExceptionCallSpy = sinon.stub().rejects(new Error('Test Exception'));
        asyncSuccessCallSpy = sinon.stub().resolves('Test Response');

        // wrap the function in a spy
        sinon
            .stub(jwt, 'decode')
            .withArgs(goodJwt, decodeOptions)
            .returns(decodedAccessToken)
            .withArgs(badJwt, decodeOptions)
            .returns(null)
            .withArgs(throwJwt, decodeOptions)
            .throws(new Error('Test Exception'));

        sinon
            .stub<Jwt, 'verify'>(jwt, 'verify')
            .withArgs(goodJwt, goodPem, verifyOptions)
            .returns(decodedAccessToken.payload!)
            .withArgs(badJwt, goodPem, verifyOptions)
            .returns('')
            .withArgs(throwJwt, goodPem, verifyOptions)
            .throws(new Error('Test Exception'))
            .withArgs(expiredJwt, goodPem, verifyOptions)
            .throwsException(new jwt.TokenExpiredError('', new Date()));

        sinon
            .stub(jwkToPem, 'default')
            .withArgs(goodKey as any)
            .returns(goodPem)
            .withArgs(badKey as any)
            .returns('')
            .withArgs(throwKey as any)
            .throws(new Error('Test Exception'));
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('jwtProvider', () => {
        describe('getAccessTokenFromRequest Function Tests', () => {
            it('should call a passed in function', () => {
                getAccessTokenFromRequest(req, { extract: successfulCallSpy });
                expect(successfulCallSpy.calledOnce).to.be.true;
            });

            it('should not throw when provided accessToken extractor function does not throw', () => {
                getAccessTokenFromRequest(req, { extract: successfulCallSpy });
            });

            it('should throw JwtValidationError with accessTokenNotFound when provided accessToken extractor function returns undefined', () => {
                successfulCallSpy = sinon.stub().returns(undefined);
                expect(() => getAccessTokenFromRequest(req, { extract: successfulCallSpy }))
                    .to.throw(JwtValidationError)
                    .and.to.have.property('errorCode', JwtVerificationErrors.accessTokenNotFound);
                expect(successfulCallSpy.calledOnce).to.be.true;
            });

            it('should throw JwtValidationError with accessTokenNotFound when provided accessToken extractor function throws non-Error', () => {
                const functionWhichThrowsNonError = () => {
                    throw 'something which is not an instanceof Error';
                };

                expect(() => getAccessTokenFromRequest(req, { extract: functionWhichThrowsNonError }))
                    .to.throw(JwtValidationError, 'Error getting access token from request')
                    .and.to.have.property('errorCode', JwtVerificationErrors.accessTokenNotFound);
            });

            it('should throw JwtValidationError with accessTokenNotFound when provided accessToken extractor function throws Error', () => {
                const regularError = new Error('something which is an instanceof Error');
                const functionWhichThrowsError = () => {
                    throw regularError;
                };

                expect(() => getAccessTokenFromRequest(req, { extract: functionWhichThrowsError }))
                    .to.throw(JwtValidationError, 'something which is an instanceof Error')
                    .and.to.have.property('errorCode', JwtVerificationErrors.accessTokenNotFound);
            });

            it('should throw JwtValidationError with accessTokenNotFound when provided accessToken extractor function throws Error with no message', () => {
                const errorWithNoMessage = new Error();
                errorWithNoMessage.name = 'some Error with a name but no message';
                const functionWhichThrowsErrorWithNoMessage = () => {
                    throw errorWithNoMessage;
                };

                expect(() => getAccessTokenFromRequest(req, { extract: functionWhichThrowsErrorWithNoMessage }))
                    .to.throw(JwtValidationError, 'some Error with a name but no message')
                    .and.to.have.property('errorCode', JwtVerificationErrors.accessTokenNotFound);
            });

            it('should pass through JwtValidationError when provided accessToken extractor function throws JwtValidationError', () => {
                const theExpectedCode = JwtVerificationErrors.invalidClaims; // Intentionally nonsense error (unit under test should not throw this)
                const jwtValidationError = new JwtValidationError('a JwtValidationError test', theExpectedCode);
                const functionWhichThrowsJwtValidationError = () => {
                    throw jwtValidationError;
                };

                expect(() => getAccessTokenFromRequest(req, { extract: functionWhichThrowsJwtValidationError }))
                    .to.throw(JwtValidationError, 'a JwtValidationError test')
                    .and.to.have.property('errorCode', theExpectedCode);
            });
        });

        describe('decodeAccessToken Function Tests', () => {
            it('should decode a valid access token', () => {
                expect(decodeAccessToken(goodJwt)).to.deep.equal(decodedAccessToken);
            });

            it('should not throw when jwt is decoded and returns a value', () => {
                expect(decodeAccessToken(goodJwt)).to.deep.equal(decodedAccessToken);
            });

            it('should throw JwtValidationError with failedToDecodeToken when decode function throws', () => {
                expect(() => decodeAccessToken(throwJwt))
                    .to.throw(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToDecodeToken);
            });

            it("should throw JwtValidationError with failedToDecodeToken when jwt is decoded and doesn't return a value", () => {
                expect(() => decodeAccessToken(badJwt))
                    .to.throw(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToDecodeToken);
            });
        });

        describe('getWellKnownEndpointKeys Function Tests', () => {
            const mockWellKnownEndpoint = 'NOT_A_REAL_URL';

            it('should use the provided function and the given endpoint', () => {
                getWellKnownEndpointKeys({ retrieve: asyncSuccessCallSpy }, mockWellKnownEndpoint);

                expect(asyncSuccessCallSpy).to.be.calledWith('NOT_A_REAL_URL');
            });

            it('should not throw when keys function succeeds', () => {
                expect(getWellKnownEndpointKeys({ retrieve: asyncSuccessCallSpy }, mockWellKnownEndpoint)).to.not.throw;
            });

            it('should throw JwtValidationError with failedToGetKeysFromWellKnownEndpoint when key function throws', async () => {
                await expect(getWellKnownEndpointKeys({ retrieve: asyncExceptionCallSpy }, mockWellKnownEndpoint))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint);
            });

            it('should throw JwtValidationError with failedToGetKeysFromWellKnownEndpoint when key function returns undefined', async () => {
                const asyncReturnsUndefinedCallSpy = sinon.stub().resolves(undefined);
                await expect(
                    getWellKnownEndpointKeys({ retrieve: asyncReturnsUndefinedCallSpy }, mockWellKnownEndpoint),
                )
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint);
            });
        });

        describe('getPemFromDecodedToken Function Tests', () => {
            it('should extract pem from decoded token', () => {
                const response = getPemFromDecodedToken(decodedAccessToken, [{ kid: 'kid' } as WellKnownEndpointKey]);
                expect(response).to.eql(goodPem);
            });

            it('should not throw error when pem extraction succeeds', () => {
                getPemFromDecodedToken(decodedAccessToken, [{ kid: 'kid' } as WellKnownEndpointKey]);
            });

            it('should throw JwtValidationError with failedToCreatePem when pem extraction throws', () => {
                const throwJwtOverride: Partial<DecodedToken> = { header: { kid: 'throw', alg: 'ES256' } };
                expect(() => getPemFromDecodedToken(throwJwtOverride, [{ kid: 'throw' } as WellKnownEndpointKey]))
                    .to.throw(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToCreatePem);
            });

            it('should throw JwtValidationError with failedToCreatePem when nothing is returned from pem function', () => {
                const badJwtOverride: Partial<DecodedToken> = { header: { kid: 'bad', alg: 'ES256' } };
                expect(() => getPemFromDecodedToken(badJwtOverride, [{ kid: 'bad' } as WellKnownEndpointKey]))
                    .to.throw(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.failedToCreatePem);
            });
        });

        describe('getPayloadFromAccessToken Function Tests', () => {
            it('should decode token when given valid jwt, pem and alg', () => {
                expect(getPayloadFromAccessToken(goodJwt, goodPem, alg)).to.eql(decodedAccessToken.payload);
            });

            it('should throw JwtValidationError with invalid token error when token extraction throws an error', () => {
                expect(() => getPayloadFromAccessToken(throwJwt, goodPem, alg))
                    .to.throw(JwtValidationError, 'Test Exception')
                    .and.have.property('errorCode', JwtVerificationErrors.invalidToken);
            });

            it('should throw JwtValidationError with invalid token error when an unparseable token is provided', () => {
                expect(() => getPayloadFromAccessToken(badJwt, goodPem, alg))
                    .to.throw(JwtValidationError, 'Token is invalid')
                    .and.have.property('errorCode', JwtVerificationErrors.invalidToken);
            });

            it('should throw JwtValidationError with token expired error when an expired token is provided', () => {
                expect(() => getPayloadFromAccessToken(expiredJwt, goodPem, alg))
                    .to.throw(JwtValidationError, 'Token expired')
                    .and.to.have.property('errorCode', JwtVerificationErrors.tokenExpired);
            });
        });
    });
});
