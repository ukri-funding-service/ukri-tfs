import { expect } from 'chai';
import { describe } from 'mocha';
import { EventLogFormatter } from '../../../src/logging';

describe('packages/auth - logging/log-formatters', () => {
    describe('eventLogFormatter', () => {
        it('should log the service name, correlation ids, event-d and user, followed by the message', () => {
            const serviceName = 'service-name';
            const correlationIds = {
                current: '1234',
                parent: '5678',
                root: '7890',
            };
            const eventId = 'eventId';
            const user = 'tfs-user-id';
            const formatter = new EventLogFormatter(serviceName, eventId, correlationIds, user);

            expect(formatter.format('message')).to.equal(
                'service-name:Messaging CorrelationID Root:7890 Parent:5678 Current:1234: event-id=eventId by user tfs-user-id - message.',
            );
        });
    });
});
