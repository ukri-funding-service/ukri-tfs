import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinonChai from 'sinon-chai';
import { RequestContext } from '../../src/auth/context';
import { buildRequestContextApiFormatter } from '../../src/logging';

describe('packages/auth - logging', () => {
    chai.use(sinonChai);

    describe('requestContextApiFormatter', () => {
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

        it('should format log messages with correlation ids and user from request context', () => {
            const formatter = buildRequestContextApiFormatter(context);
            expect(formatter.format('some description which should be logged in full')).to.equal(
                'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API by user 1234-4567-7890 - some description which should be logged in full.',
            );
        });

        it('should format log messages with correlation ids and user from request context and operation', () => {
            const formatter = buildRequestContextApiFormatter(context, 'someOperation');
            expect(formatter.format('some description which should be logged in full')).to.equal(
                'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: call to API:someOperation by user 1234-4567-7890 - some description which should be logged in full.',
            );
        });
    });
});
