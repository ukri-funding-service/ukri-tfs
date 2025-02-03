import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinonChai from 'sinon-chai';
import { RequestContext } from '../../src/auth/context';
import { buildRequestContextEventLogFormatter } from '../../src/logging';

describe('packages/auth - logging', () => {
    chai.use(sinonChai);

    describe('buildRequestContextEventLogFormatter', () => {
        const context = {
            correlationIds: {
                current: '1234',
                parent: '5678',
                root: '7890',
            },
            service: 'TEST',
            userData: {
                user: Promise.resolve(undefined),
                userId: '1234-4567-7890',
            },
        } as RequestContext;
        const eventId = 'eventId';

        const formatter = buildRequestContextEventLogFormatter(context, eventId);

        describe('format', () => {
            it('should format log messages with correlation ids and user from request context', () => {
                expect(formatter.format('some description which should be logged in full')).to.equal(
                    'TEST:Messaging CorrelationID Root:7890 Parent:5678 Current:1234: event-id=eventId by user 1234-4567-7890 - some description which should be logged in full.',
                );
            });
        });
    });
});
