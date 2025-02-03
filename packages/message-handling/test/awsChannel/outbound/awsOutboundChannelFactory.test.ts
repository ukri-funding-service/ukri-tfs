import 'mocha';
import 'sinon-chai';
import { expect } from 'chai';
import { SNSClient } from '@aws-sdk/client-sns';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';
import sinon from 'sinon';
import { AwsOutboundChannel, AwsOutboundChannelConfig, AwsOutboundChannelFactory } from '../../../src/awsChannel';

const myTopicArn = 'my:topic:arn';

const dummyChannelConfig: AwsOutboundChannelConfig = {
    channelId: 'my-channel',
    region: 'eu-west-2',
    snsTopicConfig: { topicArn: myTopicArn },
};

const dummyFifoChannelConfig: AwsOutboundChannelConfig = {
    channelId: 'my-fifo-channel',
    region: 'eu-west-2',
    snsTopicConfig: { topicArn: myTopicArn, isFIFO: true },
};

describe('packages/message-handling - awsChannel/outbound/awsOutboundChannelFactory', () => {
    const snsClient = new SNSClient({});
    let logger: Logger;

    beforeEach(() => {
        logger = sinon.spy(new DummyLogger());
    });

    afterEach(sinon.restore);

    it('should be instantiatable', () => {
        expect(new AwsOutboundChannelFactory(snsClient, logger)).to.exist;
    });

    it('should use the given logger within the factory', () => {
        const uut = new AwsOutboundChannelFactory(snsClient, logger);

        expect(uut.logger).to.equal(logger);
        expect(logger.info).to.be.calledOnce;
    });

    it('should create a channel', () => {
        const uut = new AwsOutboundChannelFactory(snsClient, logger);

        expect(uut.create(dummyChannelConfig)).to.be.an.instanceOf(AwsOutboundChannel);
    });

    it('should create a channel', () => {
        const uut = new AwsOutboundChannelFactory(snsClient, logger);

        expect(uut.create(dummyChannelConfig)).to.exist;
    });

    it('should create a channel for the designated topic', () => {
        const uut = new AwsOutboundChannelFactory(snsClient, logger);
        const channel = uut.create(dummyChannelConfig);

        expect(channel.topic.arn).to.equal(myTopicArn);
    });

    it('should create a channel for the designated topic (FIFO)', () => {
        const uut = new AwsOutboundChannelFactory(snsClient, logger);
        const channel = uut.create(dummyFifoChannelConfig);

        expect(channel.topic.arn).to.equal(myTopicArn);
    });

    it('should throw an Error if asked to create a channel with an illegal empty ARN', () => {
        const illegalConfigWithEmptyArn: AwsOutboundChannelConfig = {
            channelId: 'bad-channel',
            region: 'eu-west-2',
            snsTopicConfig: { topicArn: '' },
        };
        const uut = new AwsOutboundChannelFactory(snsClient, logger);
        expect(() => uut.create(illegalConfigWithEmptyArn)).to.throw(Error);
    });
});
