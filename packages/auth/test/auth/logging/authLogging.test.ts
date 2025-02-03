import { Logger } from '@ukri-tfs/logging';
import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import { apiLogAuthAudit, apiLogAuthDebug, apiLogAuthError } from '../../../src/auth';
import { RequestContext } from '../../../src/auth/context';

describe('Logging format tests', () => {
    chai.use(sinonChai);

    let mockLogger: Logger;
    let auditStub: SinonStub;
    let errorStub: SinonStub;
    let warningStub: SinonStub;
    let debugStub: SinonStub;
    let infoStub: SinonStub;

    let context: RequestContext;

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
    });

    describe('apiLogAuthAudit', () => {
        it('should log at audit level and include user id', () => {
            apiLogAuthAudit(context);

            expect(mockLogger.audit).calledWith(
                'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: verifying service token for request made by user 1234-4567-7890',
            );
        });
    });

    describe('apiLogAuthDebug', () => {
        it('should log at debug level and include user id and given debug message', () => {
            apiLogAuthDebug(context, 'some description which should be logged in full');

            expect(mockLogger.debug).calledWith(
                'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: verifying service token for request made by user 1234-4567-7890 - some description which should be logged in full.',
            );
        });
    });

    describe('apiLogAuthError', () => {
        it('should log at audit level and include user id', () => {
            apiLogAuthError(context, 'some description which should be logged in full');

            expect(mockLogger.error).calledWith(
                'TEST:API CorrelationID Root:7890 Parent:5678 Current:1234: failed to verify service token for request made by user 1234-4567-7890 - some description which should be logged in full.',
            );
        });
    });
});
