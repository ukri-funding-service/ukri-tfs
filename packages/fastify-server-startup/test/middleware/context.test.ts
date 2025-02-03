import { RequestWithContext } from '@ukri-tfs/auth';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage, ServerResponse } from 'http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getContextMiddleware } from '../../src/middleware';
import { getStubLogger } from '../helpers/stubLogger';
import { testUser } from '../helpers/testServer';

const correlationIdHeaders = {
    'x-rootcorrelationid': 'foo',
    'x-correlationid': 'bar',
};

const credentialHeaders = {
    'x-tfsuserid': 'bar',
};

describe('packages/fastify-server-startup - middleware', () => {
    const user = {
        ...testUser,
    };
    const res = {} as ServerResponse;

    let req;
    let middlewareOptions;
    let getUserFunctionStub: sinon.SinonStub;

    before(() => {
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    describe('context - getContextMiddleware', () => {
        beforeEach(() => {
            sinon.reset();

            req = {
                headers: {
                    ...correlationIdHeaders,
                    ...credentialHeaders,
                },
                body: '<p>someString</p>',
            } as unknown as IncomingMessage;

            middlewareOptions = {
                shortName: 'TestContext',
                logger: getStubLogger(sinon),
                getUserFunction: getUserFunctionStub,
            };

            getUserFunctionStub = sinon.stub().resolves(user);
        });

        it('should get the middleware', () => {
            const middleware = getContextMiddleware(middlewareOptions);

            expect(middleware).to.be.a('function');
        });

        it('should append the context to the request', async () => {
            // given
            const middleware = getContextMiddleware(middlewareOptions);

            // when
            await middleware(req, res);

            // then
            const requestWithContext = req as unknown as RequestWithContext;
            expect(requestWithContext.context).to.not.be.undefined;
        });

        it('should throw an error if the users credentials are missing', async () => {
            // given
            const middleware = getContextMiddleware(middlewareOptions);
            req = {
                headers: {
                    ...correlationIdHeaders,
                },
                body: '<p>someString</p>',
            } as unknown as IncomingMessage;

            // when
            await expect(middleware(req, res)).to.eventually.be.rejectedWith('Missing credentials');

            // then
            const requestWithContext = req as unknown as RequestWithContext;
            expect(requestWithContext.context).to.be.undefined;
        });
    });
});
