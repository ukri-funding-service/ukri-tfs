import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import { EventLoggerFactoryImpl } from '../../src/logging';
import { Logger } from '@ukri-tfs/logging';

describe('packages/auth - logging', () => {
    chai.use(sinonChai);

    describe('EventLoggerFactory', () => {
        describe('build', () => {
            let mockLogger: Logger;
            let auditStub: SinonStub;
            let errorStub: SinonStub;
            let warningStub: SinonStub;
            let debugStub: SinonStub;
            let infoStub: SinonStub;

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
            });

            it('should build a logger that logs in the expected event format', () => {
                const user = 'tfs-user-id';
                const service = 'service-name';
                const correlationIds = {
                    current: '1234',
                    parent: '5678',
                    root: '7890',
                };
                const eventId = 'eventId';
                const logger = new EventLoggerFactoryImpl(mockLogger, user, service, correlationIds).build(eventId);
                logger.audit('event published');
                expect(mockLogger.audit).calledWith(
                    'service-name:Messaging CorrelationID Root:7890 Parent:5678 Current:1234: event-id=eventId by user tfs-user-id - event published.',
                );
            });

            it('should build a logger that logs in the expected event format for an anonymouse user', () => {
                const user = undefined;
                const service = 'service-name';
                const correlationIds = {
                    current: '1234',
                    parent: '5678',
                    root: '7890',
                };
                const eventId = 'eventId';
                const logger = new EventLoggerFactoryImpl(mockLogger, user, service, correlationIds).build(eventId);
                logger.audit('event published');
                expect(mockLogger.audit).calledWith(
                    'service-name:Messaging CorrelationID Root:7890 Parent:5678 Current:1234: event-id=eventId by user anon - event published.',
                );
            });
        });
    });
});
