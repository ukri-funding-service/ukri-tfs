import { PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns';
import { expect } from 'chai';
import 'chai-as-promised';
import 'mocha';
import Sinon from 'sinon';
import sinon, { SinonStub } from 'sinon';
import 'sinon-chai';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';
import { SnsTopic, SnsTopicConfig } from '../../../src/awsChannel/outbound/snsTopic';

describe('packages/message-handling - awsChannel/outbound/snsTopic', () => {
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

    describe('basic operations', () => {
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

    describe('publishing', () => {
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

        it('reports original error reason when logging error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error.getCall(0).args[0]).to.match(/.*some send error.*/);
        });

        it('does not output payload when logging error on send failure', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = 'SUPER IMPORTANT';

            sendStub.rejects(new Error('some send error'));

            await expect(topic.publish(message)).to.eventually.be.rejected;

            expect(logger.error).to.have.been.called;
            expect(logger.error.getCall(0).args[0]).to.not.match(/.*SUPER IMPORTANT.*/);
        });

        it('reports the message id on a successful send', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.resolves({ MessageId: 'this-is-the-message-id', $metadata: {} } as PublishCommandOutput);

            await topic.publish(message);

            expect(logger.info.getCall(0).args[0]).to.match(/.*this-is-the-message-id.*/);
        });

        it('logs metadata at debug level on a successful send', async () => {
            const topic = new SnsTopic(sns, topicConfig, logger);
            const message = '';

            sendStub.resolves({
                MessageId: 'this-is-the-message-id',
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
