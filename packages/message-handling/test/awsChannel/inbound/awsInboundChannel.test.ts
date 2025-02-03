import { SQSClient } from '@aws-sdk/client-sqs';
import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { AwsChannelReader } from '../../../src/awsChannel/inbound/awsChannelReader';
import { AwsInboundChannel } from '../../../src/awsChannel/inbound/awsInboundChannel';
import { SqsQueue } from '../../../src/awsChannel/inbound/sqsQueue';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';

describe('packages/message-handling - awsChannel/inbound/awsInboundChannel', () => {
    let sqs: SQSClient;
    const logger = new DummyLogger();
    const queueConfig = { queueUrl: 'someUrl' };

    beforeEach(() => {
        sqs = new SQSClient({});
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

    it('can produce a reader', async () => {
        const queue = new SqsQueue(sqs, queueConfig, logger);

        const uut = new AwsInboundChannel(queue);

        const response = await uut.reader();

        expect(response).to.exist;
        expect(response).to.be.instanceOf(AwsChannelReader);
    });
});
