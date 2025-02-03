import { expect } from 'chai';
import { describe } from 'mocha';
import { ApiLogFormatter } from '../../../src/logging';

describe('packages/auth - logging/log-formatters', () => {
    const serviceName = 'service-name';
    const user = 'tfs-user-id';
    const correlationIds = {
        current: '1234',
        parent: '5678',
        root: '7890',
    };

    describe('apiLogFormatter', () => {
        it('should accept construction without operation parameter', () => {
            const uut = new ApiLogFormatter(serviceName, correlationIds, user);
            expect(uut.callSite()).to.equal('API');
        });

        it('should accept an operation construction parameter', () => {
            const uut = new ApiLogFormatter(serviceName, correlationIds, user, 'myOperation');
            expect(uut.callSite()).to.equal('API:myOperation');
        });

        it('should log the service name, correlation ids and user, followed by the message', () => {
            const formatter = new ApiLogFormatter(serviceName, correlationIds, user);

            expect(formatter.format('message')).to.equal(
                'service-name:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user tfs-user-id - message.',
            );
        });

        it('should log two element messages', () => {
            const formatter = new ApiLogFormatter(serviceName, correlationIds, user);

            expect(formatter.format('message', 'second message', 3)).to.equal(
                'service-name:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user tfs-user-id - message second message 3.',
            );
        });

        it('should log the service name, correlation ids and user, call site, followed by the message', () => {
            const formatter = new ApiLogFormatter(serviceName, correlationIds, user, 'someOperation');

            expect(formatter.format('message')).to.equal(
                'service-name:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API:someOperation by user tfs-user-id - message.',
            );
        });
    });
});
