import 'mocha';
import { expect } from 'chai';
import {
    AwsChannelFactory,
    AwsChannelConfig,
    AwsInboundChannel,
    AwsOutboundChannel,
    SnsTopic,
    SqsQueue,
} from '../../../src/pubsub/aws';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';
import sinon from 'sinon';
import 'sinon-chai';

describe('packages/message-handling - pubsub/aws', () => {
    const sqsClient = new SQSClient({});
    const snsClient = new SNSClient({});
    const myChannelUrl = 'my-queue-url';
    const myTopicArn = 'my:topic:arn';
    let logger: Logger;

    beforeEach(() => {
        logger = sinon.spy(new DummyLogger());
    });

    afterEach(sinon.restore);

    const configWithNoChannel: AwsChannelConfig = {
        inbound: [],
        outbound: [],
    };

    const configWithInboundChannel: AwsChannelConfig = {
        inbound: [{ channelId: 'my-channel', sqsQueueConfig: { queueUrl: myChannelUrl } }],
        outbound: [],
    };

    const configWithOutboundChannel: AwsChannelConfig = {
        inbound: [],
        outbound: [{ channelId: 'my-channel', snsTopicConfig: { topicArn: myTopicArn } }],
    };

    const configWithOutboundFifoChannel: AwsChannelConfig = {
        inbound: [],
        outbound: [{ channelId: 'my-fifo-channel', snsTopicConfig: { topicArn: myTopicArn, isFIFO: true } }],
    };

    const ILLEGAL_TOPIC_ARN_WITH_NO_CONTENT = '';
    const invalidConfigWithOutboundChannel: AwsChannelConfig = {
        inbound: [],
        outbound: [{ channelId: 'my-channel', snsTopicConfig: { topicArn: ILLEGAL_TOPIC_ARN_WITH_NO_CONTENT } }],
    };

    describe('AwsChannelFactory - instantiation', () => {
        it('should be instantiatable with minimal config', () => {
            expect(new AwsChannelFactory(configWithNoChannel, sqsClient, snsClient, logger)).to.exist;
        });

        it('should be instantiatable with optional logger', () => {
            expect(new AwsChannelFactory(configWithNoChannel, sqsClient, snsClient, logger)).to.exist;
        });

        it('should use the given logger within the factory', () => {
            const uut = new AwsChannelFactory(configWithInboundChannel, sqsClient, snsClient, logger);

            expect(uut.logger).to.equal(logger);
            expect(logger.info).to.be.calledOnce;
        });
    });

    describe('AwsChannelFactory - inbound channels', () => {
        const randomChannelId = Math.random().toString(16).substr(2, 8);

        it(`should reject an unknown random channel id ${randomChannelId}`, () => {
            const uut = new AwsChannelFactory(configWithInboundChannel, sqsClient, snsClient, logger);

            expect(() => uut.newInboundChannel(randomChannelId)).to.throw(Error);
        });

        it('should create a known channel id', () => {
            const uut = new AwsChannelFactory(configWithInboundChannel, sqsClient, snsClient, logger);

            expect(uut.newInboundChannel('my-channel')).to.be.an.instanceOf(AwsInboundChannel);
        });

        it('should create a channel with an SqsQueue', () => {
            const uut = new AwsChannelFactory(configWithInboundChannel, sqsClient, snsClient, logger);
            const channel = uut.newInboundChannel('my-channel') as AwsInboundChannel;

            expect(channel.queue).to.be.an.instanceOf(SqsQueue);
        });

        it('should create a channel for the designated queue', () => {
            const uut = new AwsChannelFactory(configWithInboundChannel, sqsClient, snsClient, logger);
            const channel = uut.newInboundChannel('my-channel') as AwsInboundChannel;

            expect(channel.queue.url).to.equal(myChannelUrl);
        });
    });

    describe('AwsChannelFactory - outbound channels', () => {
        const randomChannelId = Math.random().toString(16).substr(2, 8);

        it(`should reject an unknown random channel id ${randomChannelId}`, () => {
            const uut = new AwsChannelFactory(configWithOutboundChannel, sqsClient, snsClient, logger);

            expect(() => uut.newOutboundChannel(randomChannelId)).to.throw(Error);
        });

        it('should create a known channel id', () => {
            const uut = new AwsChannelFactory(configWithOutboundChannel, sqsClient, snsClient, logger);

            expect(uut.newOutboundChannel('my-channel')).to.be.an.instanceOf(AwsOutboundChannel);
        });

        it('should create a channel with an SnsQueue', () => {
            const uut = new AwsChannelFactory(configWithOutboundChannel, sqsClient, snsClient, logger);
            const channel = uut.newOutboundChannel('my-channel') as AwsOutboundChannel;

            expect(channel.topic).to.be.an.instanceOf(SnsTopic);
        });

        it('should create a channel for the designated topic', () => {
            const uut = new AwsChannelFactory(configWithOutboundChannel, sqsClient, snsClient, logger);
            const channel = uut.newOutboundChannel('my-channel') as AwsOutboundChannel;

            expect(channel.topic.arn).to.equal(myTopicArn);
        });

        it('should create a channel for the designated topic (FIFO)', () => {
            const uut = new AwsChannelFactory(configWithOutboundFifoChannel, sqsClient, snsClient, logger);
            const channel = uut.newOutboundChannel('my-fifo-channel') as AwsOutboundChannel;

            expect(channel.topic.arn).to.equal(myTopicArn);
        });

        it('should throw an Error if asked to create a channel with an illegal empty ARN', () => {
            const uut = new AwsChannelFactory(invalidConfigWithOutboundChannel, sqsClient, snsClient, logger);
            expect(() => uut.newOutboundChannel('my-channel')).to.throw(Error);
        });
    });
});
