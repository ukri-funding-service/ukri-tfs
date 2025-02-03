/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage } from 'http';
import { Algorithm, Secret, VerifyOptions } from 'jsonwebtoken';
import 'mocha';
import { Socket } from 'net';
import sinon, { SinonStub } from 'sinon';
import { extractAccessToken, isValidJwt } from '../../../src/middleware';
import * as isValidJwtFunctions from '../../../src/middleware/jwt/isValidJwt';
import * as jwtProviders from '../../../src/middleware/jwt/jwtProviders';
import { JwtValidationError, VerifyJwtMiddlewareOptions } from '../../../src/middleware/jwt/models';
import { JwtVerificationErrors } from '../../../src/security';

describe('packages/tfs-middleware - middleware/jwt', () => {
    const jwt = require('jsonwebtoken');

    // required to stub the jwt.verify's overloaded function with proper typings. Sinon uses jwt.verify's void return type instead of the object | string that we need.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/36436
    interface Jwt {
        verify: (token: string, secretOrPublicKey: Secret, options?: VerifyOptions) => object | string;
    }

    before(() => {
        chai.should();
        chai.use(chaiAsPromised);
        chai.use(require('sinon-chai'));
    });

    const socket = new Socket();
    const req = new IncomingMessage(socket);

    const goodJwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imdvb2QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY2xhaW1zIjpbXSwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.jQ96GRE02hVKv8kxG4a2CSNcWBsEce8LEoLz8uSkdZk';
    const badJwt = 'somethingElseThatIsInvalid';
    const throwAtVerifyJwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imdvb2QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY2xhaW1zIjpbInRocm93Il0sIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.VpD3w92uXHXXDzhz18QmCYwkPNdnDqkxj8nTQvUBTi8';

    const decodedToken = {
        header: {
            kid: 'good',
            alg: 'RS256',
            typ: 'JWT',
        },
        payload: {
            sub: '1234567890',
            claims: [],
            name: 'John Doe',
            iat: 1516239022,
        },
    };

    const goodPem = 'goodPem';
    const goodKey = { kid: 'good' };

    const decodeOptions = { complete: true, json: true };
    const alg: Algorithm = 'RS256';
    const verifyOptions = { algorithms: [alg] };

    let getAccessTokenStub: sinon.SinonStub<any, any>;

    const badJwtError = new Error('Test Exception at decode');
    const throwAtVerifyError = new Error('Test Exception at verify');

    beforeEach(() => {
        sinon.restore();
        getAccessTokenStub = sinon.stub();
        sinon
            .stub(jwt, 'decode')
            .withArgs(goodJwt, decodeOptions)
            .returns(decodedToken)
            .withArgs(throwAtVerifyJwt, decodeOptions)
            .returns(decodedToken)
            .withArgs(badJwt, decodeOptions)
            .throws(badJwtError);

        sinon
            .stub<Jwt, 'verify'>(jwt, 'verify')
            .withArgs(goodJwt, goodPem, verifyOptions)
            .returns(decodedToken.payload)
            .withArgs(throwAtVerifyJwt, goodPem, verifyOptions)
            .throws(throwAtVerifyError);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('isValidJwt', () => {
        it('should resolve if no error is thrown', async () => {
            sinon.stub(isValidJwtFunctions, 'extractPayloadFromAccessToken').resolves(goodJwt);

            getAccessTokenStub.returns(goodJwt);
            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([goodKey as any]) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req)).to.be.fulfilled;
        });

        it('should reject with JwtValidationError/accessTokenNotFound if access token getter function throws', async () => {
            getAccessTokenStub.throws(new JwtValidationError('SOME ERROR', JwtVerificationErrors.accessTokenNotFound));

            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([]) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError)
                .and.to.have.property('errorCode', JwtVerificationErrors.accessTokenNotFound);
        });

        it('should reject with JwtValidationError/failedToDecodeToken error if decodeAccessToken function throws', async () => {
            getAccessTokenStub.returns(badJwt);

            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([]) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError, 'Test Exception')
                .and.have.property('errorCode', JwtVerificationErrors.failedToDecodeToken);
        });

        it('should reject with JwtValidationError/failedToGetKeysFromWellKnownEndpoint error if getWellKnownEndpointKeys function throws ', async () => {
            getAccessTokenStub.returns(goodJwt);
            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.reject(new Error('THIS_IS_EXPECTED')) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError)
                .and.have.property('errorCode', JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint);
        });

        it('should reject with JwtValidationError/failedToCreatePem if getPemFromDecodedToken function throws', async () => {
            getAccessTokenStub.returns(goodJwt);
            sinon.stub(jwtProviders, 'getPemFromDecodedToken').throws(new Error('Test Exception'));

            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([goodKey as any]) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError)
                .and.have.property('errorCode', JwtVerificationErrors.failedToCreatePem);
        });

        it('should reject with JwtValidationError/invalidToken if getPayloadFromAccessToken function rejects', async () => {
            sinon
                .stub(isValidJwtFunctions, 'extractPayloadFromAccessToken')
                .rejects(new JwtValidationError('bang', JwtVerificationErrors.invalidToken));

            getAccessTokenStub.returns(goodJwt);
            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([goodKey as any]) },
                requiredClaims: [],
                claimsVerifier: { verify: () => Promise.resolve() },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError)
                .and.have.property('errorCode', JwtVerificationErrors.invalidToken);
        });

        it('should reject with JwtValidationError/invalidClaims if verifyClaimsInPayload function throws', async () => {
            sinon.stub(isValidJwtFunctions, 'extractPayloadFromAccessToken').resolves(goodJwt);

            getAccessTokenStub.returns(goodJwt);
            const options: VerifyJwtMiddlewareOptions = {
                rawTokenExtractor: { extract: getAccessTokenStub },
                keysAccessor: { retrieve: () => Promise.resolve([goodKey as any]) },
                requiredClaims: [],
                claimsVerifier: {
                    verify: () =>
                        Promise.reject(new JwtValidationError('THIS_IS_EXPECTED', JwtVerificationErrors.invalidClaims)),
                },
                wellKnownEndpoint: 'NOT_A_REAL_URL',
            };

            const middleware = isValidJwt(options);
            await expect(middleware(req))
                .to.eventually.be.rejectedWith(JwtValidationError)
                .and.have.property('errorCode', JwtVerificationErrors.invalidClaims);
        });

        describe('errors related to claims', () => {
            let verifyClaimsFn: SinonStub;
            let options: VerifyJwtMiddlewareOptions;

            beforeEach(() => {
                verifyClaimsFn = sinon.stub();
                getAccessTokenStub.returns(goodJwt);
                options = {
                    rawTokenExtractor: { extract: getAccessTokenStub },
                    keysAccessor: { retrieve: () => Promise.resolve([goodKey as any]) },
                    requiredClaims: [],
                    claimsVerifier: { verify: verifyClaimsFn },
                    wellKnownEndpoint: 'NOT_A_REAL_URL',
                };
                sinon.stub(isValidJwtFunctions, 'extractPayloadFromAccessToken').resolves(goodJwt);
            });

            afterEach(sinon.restore);

            it('should be fulfilled when claims are validated', async () => {
                verifyClaimsFn.resolves(true);

                const middleware = isValidJwt(options);
                await expect(middleware(req)).to.eventually.be.fulfilled;
            });

            it('should use the verifyClaims function provided', async () => {
                verifyClaimsFn.resolves(true);

                const middleware = isValidJwt(options);
                await middleware(req);

                expect(verifyClaimsFn).to.have.been.called;
            });

            it('should reject with JwtValidationError/InvalidToken error when claim verifying function throws plain Error', async () => {
                verifyClaimsFn.rejects(new Error('bad claims'));

                const middleware = isValidJwt(options);
                await expect(middleware(req))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.invalidToken);
            });

            it('should reject with provided error when claim verifying function throws JwtValidationError', async () => {
                verifyClaimsFn.rejects(new JwtValidationError('bad claims', JwtVerificationErrors.invalidClaims));

                const middleware = isValidJwt(options);
                await expect(middleware(req))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.have.property('errorCode', JwtVerificationErrors.invalidClaims);
            });
        });

        describe('extractAccessToken', () => {
            it('should return access token when no errors occur', async () => {
                sinon.stub(jwtProviders, 'getAccessTokenFromRequest').returns(goodJwt);
                await expect(
                    extractAccessToken(req, { extract: sinon.stub() }),
                ).to.eventually.be.fulfilled.and.to.equal(goodJwt);
            });

            it('should reject with thrown error when getAccessTokenFromRequest throws JwtValidationError', async () => {
                const jwtError = new JwtValidationError('blah', JwtVerificationErrors.accessTokenNotFound);

                sinon.stub(jwtProviders, 'getAccessTokenFromRequest').throws(jwtError);

                await expect(extractAccessToken(req, { extract: sinon.stub() }))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.to.have.property('errorCode', jwtError.errorCode);
            });

            it('should reject with given JwtValidationError/InvalidToken when getAccessTokenFromRequest throws plain Error', async () => {
                const plainError = new Error('blah');

                sinon.stub(jwtProviders, 'getAccessTokenFromRequest').throws(plainError);

                await expect(extractAccessToken(req, { extract: sinon.stub() }))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.to.have.property('errorCode', JwtVerificationErrors.invalidToken);
            });

            it('should reject with JwtValidationError/InvalidToken error when getAccessTokenFromRequest throws non-Error', async () => {
                const nonError = 'blah';

                sinon.stub(jwtProviders, 'getAccessTokenFromRequest').throws(nonError);

                await expect(extractAccessToken(req, { extract: sinon.stub() }))
                    .to.eventually.be.rejectedWith(JwtValidationError)
                    .and.to.have.property('errorCode', JwtVerificationErrors.invalidToken);
            });
        });
    });
});
