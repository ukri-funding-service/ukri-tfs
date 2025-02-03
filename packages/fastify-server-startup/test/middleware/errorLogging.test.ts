import { RequestContext } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { FastifyError, FastifyRequest } from 'fastify';
import createError from 'fastify-error';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { logUncaughtErrors } from '../../src/middleware';
import { getStubLogger } from '../helpers/stubLogger';

describe('packages/fastify-server-startup - middleware/errorLogging', () => {
    let req;
    let logger: Logger;

    before(() => {
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    describe('logUncaughtErrors', () => {
        beforeEach(() => {
            sinon.reset();
            logger = getStubLogger(sinon);

            const reqContext: RequestContext = {
                userData: { user: Promise.resolve(undefined) },
                logger,
                service: 'Test Service',
                correlationIds: {
                    root: 'foo',
                    parent: 'bar',
                    current: 'bar',
                },
            };

            req = { getContext: () => reqContext } as unknown as FastifyRequest;
        });

        it('should handle 500 errors', () => {
            const error500 = createError('Internal Server Error', 'example fault')();
            logUncaughtErrors(error500, req);
            expect(logger.warn).to.be.calledOnceWith(
                sinon.match(
                    /Test Service:API CorrelationID Root:foo Parent:bar Current:bar: call to API by user \[NO USER AUTHENTICATED\] - 500 exception thrown while handling request: example fault :: FastifyError: example fault/,
                ),
            );
        });

        it('should handle non-500 errors', async () => {
            const error404 = createError('404', 'example fault', 404)();
            logUncaughtErrors(error404, req);
            expect(logger.warn).to.be.calledOnceWith(
                sinon.match(
                    /Test Service:API CorrelationID Root:foo Parent:bar Current:bar: call to API by user \[NO USER AUTHENTICATED\] - Uncaught exception without status code thrown while handling request: example fault :: FastifyError: example fault/,
                ),
            );
        });

        it('should handle non conventional errors', async () => {
            const errorUnknown = 'wibble' as unknown as FastifyError;
            logUncaughtErrors(errorUnknown, req);
            expect(logger.warn).to.be.calledOnceWith(
                sinon.match(
                    /Test Service:API CorrelationID Root:foo Parent:bar Current:bar: call to API by user \[NO USER AUTHENTICATED\] - Uncaught thrown entity while handling request: wibble/,
                ),
            );
        });
    });
});
