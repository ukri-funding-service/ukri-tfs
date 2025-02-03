import { SNSClient } from '@aws-sdk/client-sns';
import { expect } from 'chai';
import 'chai-as-promised';
import 'mocha';
import { default as Sinon, default as sinon, SinonStub } from 'sinon';
import 'sinon-chai';
import { Logger } from '../../../src/logger';
import { SnsFIFOTopic, SnsFIFOTopicConfig, SnsTopicConfig } from '../../../src/pubsub';
import { SnsTopic } from '../../../src/pubsub/aws/snsTopic';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';

describe('packages/message-handling - pubsub/aws', () => {
    const topicConfig: SnsTopicConfig = {
        topicArn: 'my-topic',
    };
    let sns: SNSClient;
    let sendStub: SinonStub;
    let loggerInstance: Logger;
    let logger: Sinon.SinonSpiedInstance<Logger>;

    beforeEach(() => {
        sns = new SNSClient({});
        sendStub = sinon.stub(sns, 'send');
        loggerInstance = new DummyLogger();
        logger = sinon.spy(loggerInstance);
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    describe('snsTopic - basic operations', () => {
        it('can be instantiated', () => {
            expect(new SnsTopic(sns, topicConfig, logger)).itself.exist;
        });

        it('returns expected arn', () => {
            expect(new SnsTopic(sns, topicConfig, logger).arn).equals(topicConfig.topicArn);
        });

        it('returns name matching ARN by default', () => {
            expect(new SnsTopic(sns, topicConfig, logger).name).equals(topicConfig.topicArn);
        });
    });

    describe('snsTopic - publishing', () => {
        it('publishes message', () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = 'hello';
            sendStub.resolves();

            expect(topic.publish(message)).to.eventually.be.fulfilled;

            const expectedParams = {
                Message: 'hello',
                TopicArn: topicConfig.topicArn,
            };

            expect(sendStub).to.have.been.calledOnce;

            const sendArg = sendStub.getCall(0).args[0];
            expect(sendArg).to.have.property('input');
            expect(sendArg.input).to.deep.equal(expectedParams);
        });

        it('publishes when given an empty body', () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.resolves();

            expect(topic.publish(message)).to.eventually.be.fulfilled;

            const expectedParams = {
                Message: '',
                TopicArn: topicConfig.topicArn,
            };

            expect(sendStub).to.have.been.calledOnce;

            const sendArg = sendStub.getCall(0).args[0];
            expect(sendArg).to.have.property('input');
            expect(sendArg.input).to.deep.equal(expectedParams);
        });

        it('logs an error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.be.calledOnce;
        });

        it('reports arn when logging error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*my-topic.*/);
        });

        it('does not output payload when logging error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.not.match(/.*SUPER IMPORTANT.*/);
        });

        it('reports original error reason when logging error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*some send error.*/);
        });

        it('outputs the ARN on error from send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.match(/.*my-topic*/);
        });
    });

    describe('snsFIFOTopic - publishing', () => {
        const fifoTopicConfigWithGroupId: SnsFIFOTopicConfig = {
            isFIFO: true,
            topicArn: 'my-topic',
            groupId: 'my-group-id',
        };

        it('publishes message (with group-id)', () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = 'hello';
            sendStub.resolves();

            expect(topic.publish(message)).to.eventually.be.fulfilled;

            expect(sendStub).to.have.been.calledOnce;

            const expectedParams = {
                Message: 'hello',
                TopicArn: topicConfig.topicArn,
                MessageGroupId: 'my-group-id',
            };

            const sendArg = sendStub.getCall(0).args[0];
            expect(sendArg).to.have.property('input');
            expect(sendArg.input).to.deep.equal(expectedParams);
        });

        it('publishes message (without group-id)', () => {
            const topic = new SnsFIFOTopic(sns, { ...fifoTopicConfigWithGroupId, groupId: '' }, logger);
            const message = 'hello';
            sendStub.resolves();

            expect(topic.publish(message)).to.eventually.be.fulfilled;

            expect(sendStub).to.have.been.calledOnce;

            const expectedParams = {
                Message: 'hello',
                TopicArn: topicConfig.topicArn,
            };

            const sendArg = sendStub.getCall(0).args[0];
            expect(sendArg).to.have.property('input');
            expect(sendArg.input).to.deep.equal(expectedParams);
        });

        it('publishes when given an empty body (with group-id)', () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.resolves();

            expect(topic.publish(message)).to.eventually.be.fulfilled;

            const expectedParams = {
                Message: '',
                TopicArn: topicConfig.topicArn,
                MessageGroupId: 'my-group-id',
            };

            expect(sendStub).to.have.been.calledOnce;

            const sendArg = sendStub.getCall(0).args[0];
            expect(sendArg).to.have.property('input');
            expect(sendArg.input).to.deep.equal(expectedParams);
        });

        it('does not output payload when logging error on send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.not.match(/.*SUPER IMPORTANT.*/);
        });

        it('outputs the ARN on error from send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.match(/.*my-topic*/);
        });

        it('outputs the group id on error from send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.match(/.*my-group-id*/);
        });
    });
});
