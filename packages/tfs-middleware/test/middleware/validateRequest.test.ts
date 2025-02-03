/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import sinon from 'sinon';
import { validateRequest, ValidateRequestOptions } from '../../src/middleware';
import { ConsoleLogger } from '@ukri-tfs/logging';

describe('validate request tests', () => {
    chai.should();
    chai.use(chaiAsPromised);

    const logger = new ConsoleLogger(console);
    const socket = new Socket();
    let req = new IncomingMessage(socket);

    let verifySpy = sinon.stub();
    beforeEach(() => {
        sinon.restore();
        verifySpy = sinon.stub();
        verifySpy.withArgs(undefined).resolves(false);
        verifySpy.withArgs('NEWACCESSTOKEN').resolves(true);
        req = new IncomingMessage(socket);
    });

    it('should reject if user session not found', async () => {
        const getAccessTokenSpy = sinon.stub().resolves(undefined);
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.spy();
        verifySpy = sinon.stub().resolves(true);

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,

            wellKnownKeysEndpoint: '',
            refreshToken: '',
            accessTokenExpirySeconds: 30,
        };

        return expect(validateRequest(req, logger, options)).to.eventually.be.rejectedWith('No session found');
    });

    it('should resolve if current access token is valid', async () => {
        (req as any).session = { passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves('BLAH');
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.spy();
        verifySpy = sinon.stub().resolves(true);

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,

            wellKnownKeysEndpoint: '',
            refreshToken: '',
            accessTokenExpirySeconds: 30,
        };

        return expect(validateRequest(req, logger, options)).to.eventually.eql(undefined);
    });

    it('should attempt to refresh token if access token not found', async () => {
        (req as any).session = { passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves(undefined);
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.stub().resolves('NEWACCESSTOKEN');

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,
            wellKnownKeysEndpoint: '',
            refreshToken: 'REFRESHTOKEN',
            accessTokenExpirySeconds: 30,
        };

        await validateRequest(req, logger, options);

        return expect(refreshAccessTokenSpy.calledOnce).to.be.true;
    });

    it('should reject if no refresh token is found', async () => {
        (req as any).session = { passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves('NEWACCESSTOKEN');
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.spy();
        verifySpy = sinon.stub().resolves(false);

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,
            wellKnownKeysEndpoint: '',
            refreshToken: undefined,
            accessTokenExpirySeconds: 30,
        };

        return expect(validateRequest(req, logger, options)).to.eventually.be.rejectedWith('Refresh token not found');
    });

    it('should set new user access token if one is refreshed successfully', async () => {
        (req as any).session = { id: 'TEST', passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves(undefined);
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.stub().resolves('NEWACCESSTOKEN');

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,

            wellKnownKeysEndpoint: '',
            refreshToken: 'REFRESHTOKEN',
            accessTokenExpirySeconds: 30,
        };

        await validateRequest(req, logger, options);

        return expect(setAccessTokenSpy.calledOnceWith('TEST', 'NEWACCESSTOKEN', 30)).to.be.true;
    });

    it('should reject if error refreshing access token', async () => {
        (req as any).session = { passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves(undefined);
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.stub().throws();
        verifySpy = sinon.stub().resolves(false);

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,

            wellKnownKeysEndpoint: '',
            refreshToken: '',
            accessTokenExpirySeconds: 30,
        };

        return expect(validateRequest(req, logger, options)).to.eventually.be.rejectedWith('');
    });

    it('should resolve if new access token is valid', async () => {
        (req as any).session = { id: 'TEST', passport: { user: {} } };

        const getAccessTokenSpy = sinon.stub().resolves(undefined);
        const setAccessTokenSpy = sinon.spy();
        const refreshAccessTokenSpy = sinon.stub().resolves('NEWACCESSTOKEN');

        const options: ValidateRequestOptions = {
            getUserAccessToken: getAccessTokenSpy,
            setUserAccessToken: setAccessTokenSpy,
            refreshAccessToken: refreshAccessTokenSpy,
            verifyAccessToken: verifySpy,

            wellKnownKeysEndpoint: '',
            refreshToken: 'REFRESH',
            accessTokenExpirySeconds: 30,
        };

        return expect(validateRequest(req, logger, options)).to.eventually.eql(undefined);
    });
});
