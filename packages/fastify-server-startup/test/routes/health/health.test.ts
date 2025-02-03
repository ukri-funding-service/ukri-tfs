import { expect, use } from 'chai';
import { FastifyReply, FastifyRequest } from 'fastify';
import { describe, it } from 'mocha';
import Sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { doHealthCheck } from '../../../src/routes/health/index';

describe('health checker', () => {
    beforeEach(() => {
        use(sinonChai);
    });

    it('everything passes with no checks', async () => {
        const sendStub = Sinon.stub();
        const statusStub = Sinon.stub().callsFake(() => ({ send: sendStub }));

        await doHealthCheck({} as unknown as FastifyRequest, { status: statusStub } as unknown as FastifyReply, []);

        expect(sendStub).to.be.called;
        expect(statusStub).to.be.calledWith(200);
    });

    it('should pass if health checks pass', async () => {
        const sendStub = Sinon.stub();
        const statusStub = Sinon.stub().callsFake(() => ({ send: sendStub }));

        await doHealthCheck({} as unknown as FastifyRequest, { status: statusStub } as unknown as FastifyReply, [
            {
                validationMethod: 'validateTypeOrmConnectionWithTimeout',
                thingToValidate: async () => ({
                    query: Sinon.stub().resolves(),
                }),
            },
        ]);

        expect(sendStub).to.be.called;
        expect(sendStub).to.be.calledWith({ status: 'OK' });
        expect(statusStub).to.be.calledWith(200);
    });

    it('returns error response if there is a failing health check', async () => {
        const sendStub = Sinon.stub();
        const statusStub = Sinon.stub().callsFake(() => ({ send: sendStub }));

        await doHealthCheck({} as unknown as FastifyRequest, { status: statusStub } as unknown as FastifyReply, [
            {
                validationMethod: 'validateTypeOrmConnectionWithTimeout',
                thingToValidate: () => Promise.reject(),
            },
        ]);

        expect(sendStub).to.be.called;
        expect(sendStub).to.be.calledWith({ messages: ['Cannot connect to database'], status: 'ERROR' });
        expect(statusStub).to.be.calledWith(500);
    });
});
