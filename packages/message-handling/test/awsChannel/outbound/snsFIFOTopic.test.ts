import { PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns';
import { expect } from 'chai';
import 'chai-as-promised';
import 'mocha';
import Sinon from 'sinon';
import sinon, { SinonStub } from 'sinon';
import 'sinon-chai';
import { SnsFIFOTopic, SnsFIFOTopicConfig } from '../../../src/awsChannel/outbound';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';

describe('packages/message-handling - awsChannel/outbound/snsFIFOTopic', () => {
    const topicConfig: SnsFIFOTopicConfig = {
        topicArn: 'my-fifo-topic',
        isFIFO: true,
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

    describe('basic operations', () => {
        it('can be instantiated', () => {
            expect(new SnsFIFOTopic(sns, topicConfig, logger)).itself.exist;
        });

        it('returns expected arn', () => {
            expect(new SnsFIFOTopic(sns, topicConfig, logger).arn).equals(topicConfig.topicArn);
        });

        it('returns name matching ARN by default', () => {
            expect(new SnsFIFOTopic(sns, topicConfig, logger).name).equals(topicConfig.topicArn);
        });
    });

    describe('publishing', () => {
        const fifoTopicConfigWithGroupId: SnsFIFOTopicConfig = {
            isFIFO: true,
            topicArn: 'my-fifo-topic',
            groupId: 'my-group-id',
        };
        const fifoTopicConfigWithoutGroupId: SnsFIFOTopicConfig = { isFIFO: true, topicArn: 'my-fifo-topic' };

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

        it('publishes message (without group-id)', () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithoutGroupId, logger);
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

        it('publishes when given an empty body (without group-id)', () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithoutGroupId, logger);
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
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.be.calledOnce;
        });

        it('reports arn when logging error on send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*my-fifo-topic.*/);
        });

        it('reports group id when logging error on send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*my-group-id.*/);
        });

        it('reports original error reason when logging error on send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*some send error.*/);
        });

        it('does not output payload when logging error on send failure', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.not.match(/.*SUPER IMPORTANT.*/);
        });

        it('reports the message id on a successful send', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.resolves({ MessageId: 'this-is-the-message-id', $metadata: {} } as PublishCommandOutput);

            await topic.publish(message);

            expect(logger.info.getCall(0).args[0]).to.match(/.*this-is-the-message-id.*/);
        });

        it('reports the sequence id on a successful send', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.resolves({ SequenceNumber: '424242', $metadata: {} } as PublishCommandOutput);

            await topic.publish(message);

            expect(logger.info.getCall(0).args[0]).to.match(/.*424242.*/);
        });

        it('logs metadata at debug level on a successful send', async () => {
            const topic = new SnsFIFOTopic(sns, fifoTopicConfigWithGroupId, logger);
            const message = '';

            sendStub.resolves({
                MessageId: 'this-is-the-message-id',
                SequenceNumber: '424242',
                $metadata: { requestId: 'the-metadata-request-id' },
            } as PublishCommandOutput);

            await topic.publish(message);

            let foundAMatchingEntry = false;

            logger.debug.getCalls().forEach(call => {
                if ((call.args[0] as string).match(/this-is-the-message-id.+the-metadata-request-id/)) {
                    foundAMatchingEntry = true;
                }
            });

            expect(foundAMatchingEntry).is.true;
        });
    });
});
