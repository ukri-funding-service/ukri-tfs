import { SQSClient } from '@aws-sdk/client-sqs';
import { expect } from 'chai';
import 'mocha';
import sinon, { SinonStub } from 'sinon';
import { AwsInboundChannel } from '../../../src/pubsub/aws/awsInboundChannel';
import { SqsQueue } from '../../../src/pubsub/aws/sqsQueue';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';

describe('packages/message-handling - pubsub/aws/awsInboundChannel', () => {
    const logger = new DummyLogger();
    const queueConfig = { queueUrl: 'someUrl' };

    let sqs: SQSClient;
    let sendStub: SinonStub;

    beforeEach(() => {
        sqs = new SQSClient({});
        sendStub = sinon.stub(sqs, 'send');
    });

    afterEach(sinon.restore);

    it('can be instantiated', () => {
        const queue = new SqsQueue(sqs, queueConfig, logger);
        expect(new AwsInboundChannel(queue)).to.exist;
    });

    it('can access the underlying queue', () => {
        const queue = new SqsQueue(sqs, queueConfig, logger);
        expect(new AwsInboundChannel(queue).queue).to.equal(queue);
    });

    it('can receive a message', async () => {
        const queue = new SqsQueue(sqs, queueConfig, logger);
        sendStub.resolves({
            Messages: [{ MessageId: '1', Body: '{ "type": "1", "data": {"blah": "blah"}}', ReceiptHandle: '1' }],
        });

        const uut = new AwsInboundChannel(queue);

        const response = await uut.receive();

        expect(response.length).to.equal(1);
        expect(response[0]).to.deep.equal({ type: '1', data: { blah: 'blah' } });
    });
});
