import { Logger } from '@ukri-tfs/logging';
import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import { RequestContext } from '../../src/auth/context';
import { buildRequestContextApiLogger } from '../../src/logging';

describe('packages/auth - logging', () => {
    chai.use(sinonChai);

    describe('regression tests for existing logging behaviour', () => {
        let mockLogger: Logger;
        let auditStub: SinonStub;
        let errorStub: SinonStub;
        let warningStub: SinonStub;
        let debugStub: SinonStub;
        let infoStub: SinonStub;

        let context: RequestContext;

        let logger: Logger;

        afterEach(sinon.restore);

        beforeEach(() => {
            auditStub = sinon.stub();
            errorStub = sinon.stub();
            warningStub = sinon.stub();
            debugStub = sinon.stub();
            infoStub = sinon.stub();

            mockLogger = {
                audit: auditStub,
                debug: debugStub,
                error: errorStub,
                warn: warningStub,
                info: infoStub,
            };

            context = {
                correlationIds: {
                    current: '1234',
                    parent: '5678',
                    root: '7890',
                },
                logger: mockLogger,
                service: 'TEST',
                userData: {
                    user: Promise.resolve(undefined),
                    userId: '1234-4567-7890',
                },
            };

            logger = buildRequestContextApiLogger(context);
        });

        describe('audit', () => {
            it('should log at audit level with all required data', () => {
                logger.audit('some description which should be logged in full', 'second desc');

                expect(mockLogger.audit).calledWith(
                    'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full second desc.',
                );
            });
        });

        describe('error', () => {
            it('should log at error level with standard data and given error message', () => {
                logger.error('some description which should be logged in full', 'second desc');

                expect(errorStub).calledWith(
                    'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full second desc.',
                );
            });
        });

        describe('warn', () => {
            it('should log at warn level with standard data and given error message', () => {
                logger.warn('some description which should be logged in full', 'second desc');

                expect(warningStub).calledWith(
                    'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full second desc.',
                );
            });
        });

        describe('debug', () => {
            it('should log at debug level with standard data, given error message, and stack trace', () => {
                logger.debug(new Error('some description which should be logged in full'));

                expect(debugStub).calledOnce;

                // REGEX: match error message on first line, then at least one line starting with '   at ' (which is the basic format of the stack trace output)
                expect(debugStub.args[0][0]).to.match(
                    /^TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - +Error: some description which should be logged in full\n( *at .*\n)+/,
                );
            });

            it('should log all inputs when deligating non-error type messages', () => {
                logger.debug('some description which should be logged in full', 'second desc');

                expect(debugStub).calledWith(
                    'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full second desc.',
                );
            });
        });

        describe('info', () => {
            it('should log at info level with standard data and given message', () => {
                logger.info('some description which should be logged in full', 'second desc');

                expect(infoStub).calledWith(
                    'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full second desc.',
                );
            });
        });
    });
});
