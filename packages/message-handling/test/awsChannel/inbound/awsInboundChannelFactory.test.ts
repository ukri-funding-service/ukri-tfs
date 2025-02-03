import 'mocha';
import { expect } from 'chai';

import { SQSClient } from '@aws-sdk/client-sqs';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';
import sinon from 'sinon';
import 'sinon-chai';

import { AwsInboundChannel, AwsInboundChannelFactory, SqsQueue } from '../../../src/awsChannel/inbound';

const myChannelUrl = 'my-queue-url';

describe('packages/message-handling - awsChannel/inbound/awsInboundChannelFactory', () => {
    const sqsClient = new SQSClient({});
    let logger: Logger;

    beforeEach(() => {
        logger = sinon.spy(new DummyLogger());
    });

    afterEach(sinon.restore);

    it('should be instantiatable with minimal config', () => {
        expect(new AwsInboundChannelFactory(sqsClient)).to.exist;
    });

    it('should be instantiatable with optional logger', () => {
        expect(new AwsInboundChannelFactory(sqsClient, logger)).to.exist;
    });

    it('should use the given logger within the factory', () => {
        const uut = new AwsInboundChannelFactory(sqsClient, logger);

        expect(uut.logger).to.equal(logger);
        expect(logger.info).to.be.calledOnce;
    });

    it('should create a channel', () => {
        const uut = new AwsInboundChannelFactory(sqsClient);

        expect(uut.create({ channelId: 'my-channel', sqsQueueConfig: { queueUrl: myChannelUrl } })).to.be.an.instanceOf(
            AwsInboundChannel,
        );
    });

    it('should create a channel with an SqsQueue', () => {
        const uut = new AwsInboundChannelFactory(sqsClient);
        const channel = uut.create({ channelId: 'my-channel', sqsQueueConfig: { queueUrl: myChannelUrl } });

        expect(channel.queue).to.be.an.instanceOf(SqsQueue);
    });

    it('should create a channel for the designated queue', () => {
        const uut = new AwsInboundChannelFactory(sqsClient);
        const channel = uut.create({ channelId: 'my-channel', sqsQueueConfig: { queueUrl: myChannelUrl } });

        expect(channel.queue.url).to.equal(myChannelUrl);
    });
});
