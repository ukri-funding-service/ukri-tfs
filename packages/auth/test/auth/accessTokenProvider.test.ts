import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { AccessTokenProvider, createAccessTokenProvider } from '../../src/auth';
import { Logger } from '@ukri-tfs/logging';

describe('accessTokenProvider tests', async () => {
    chai.should();

    const mockLogger: Logger = {
        audit: sinon.stub(),
        error: sinon.stub(),
        warn: sinon.stub(),
        info: sinon.stub(),
        debug: sinon.stub(),
    };
    beforeEach(() => {
        chai.use(sinonChai);
    });
    afterEach(() => {
        sinon.restore();
    });
    describe('create accessTokenProvider tests', async () => {
        it('should not throw an error when all parameters are provided to create a token provider', async () => {
            const scope = 'scope';
            const url = 'http://127.0.0.1';
            const clientId = 'client';
            const clientSecret = 'secret';

            expect(() => createAccessTokenProvider(mockLogger, scope, url, clientId, clientSecret)).to.not.throw();
        });

        it('should throw an error when required parameter is empty in call to create a token provider', async () => {
            const scope = '';
            const url = 'http://127.0.0.1';
            const clientId = 'client';
            const clientSecret = 'secret';

            const expectedMessage =
                'createAccessTokenProvider failed for these parameters: {' +
                'scope: (not set), ' +
                'url: http://127.0.0.1, ' +
                'clientId: (redacted), ' +
                'clientSecret: (redacted)}';

            expect(() => createAccessTokenProvider(mockLogger, scope, url, clientId, clientSecret))
                .to.throw(Error)
                .that.has.property('message')
                .which.equals(expectedMessage);
        });
    });
    describe('getCurrentAccessToken tests', async () => {
        let accessTokenProvider: AccessTokenProvider;

        beforeEach(async () => {
            accessTokenProvider = new AccessTokenProvider(
                { url: '', clientId: '', clientSecret: '', scope: '' },
                mockLogger,
            );
            accessTokenProvider.getAccessToken = sinon.stub().resolves('fakeToken');
            await accessTokenProvider.refreshAccessToken();
            sinon.restore();
        });

        it('should refresh the token if it has expired', async () => {
            accessTokenProvider.refreshAccessToken = sinon.stub().resolves();
            accessTokenProvider.tokenIsExpiringOrInvalid = sinon.stub().resolves(true); // Expired

            await accessTokenProvider.getCurrentAccessToken();

            expect(accessTokenProvider.refreshAccessToken).to.be.called;
            expect(accessTokenProvider.tokenIsExpiringOrInvalid).to.be.called;
        });

        it("should not refresh the token if it hasn't expired", async () => {
            accessTokenProvider.refreshAccessToken = sinon.stub().resolves();
            accessTokenProvider.tokenIsExpiringOrInvalid = sinon.stub().resolves(false); // Not expired

            await accessTokenProvider.getCurrentAccessToken();

            expect(accessTokenProvider.refreshAccessToken).to.not.be.called;
            expect(accessTokenProvider.tokenIsExpiringOrInvalid).to.be.called;
        });
    });
    describe('tokenIsExpiringOrInvalid tests', async () => {
        let accessTokenProvider: AccessTokenProvider;

        beforeEach(async () => {
            accessTokenProvider = new AccessTokenProvider(
                { url: '', clientId: '', clientSecret: '', scope: '' },
                mockLogger,
            );
        });

        it('should return true if the token has expired', async () => {
            const expiredToken = jwt.sign({}, 'secret', { expiresIn: -20 });

            const result = await accessTokenProvider.tokenIsExpiringOrInvalid(expiredToken);

            expect(result).to.be.true;
        });

        it('should return true if the token has less than 30 seconds until expiry', async () => {
            const expiredToken = jwt.sign({}, 'secret', { expiresIn: 29 });

            const result = await accessTokenProvider.tokenIsExpiringOrInvalid(expiredToken);

            expect(result).to.be.true;
        });

        it("should return true if the token doesn't exist", async () => {
            const result = await accessTokenProvider.tokenIsExpiringOrInvalid('');

            expect(result).to.be.true;
        });

        it("should return false if the token hasn't expired", async () => {
            const validToken = jwt.sign({}, 'secret', { expiresIn: 10000 });

            const result = await accessTokenProvider.tokenIsExpiringOrInvalid(validToken);

            expect(result).to.be.false;
        });
    });
});
