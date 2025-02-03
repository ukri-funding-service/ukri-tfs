import 'mocha';
import { expect } from 'chai';
import 'chai-as-promised';
import { SNSClient } from '@aws-sdk/client-sns';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { AwsOutboundChannel, SnsTopic, SnsTopicConfig } from '../../../src/awsChannel/outbound';

describe('packages/message-handling - awsChannel/outbound/awsOutboundChannel', () => {
    let sns: SNSClient;
    const logger = new DummyLogger();

    beforeEach(() => {
        sns = new SNSClient({});
    });

    describe('awsOutboundChannel', () => {
        const topicConfig: SnsTopicConfig = {
            topicArn: 'my-topic',
        };
        let topic: SnsTopic;

        beforeEach(() => {
            topic = new SnsTopic(sns, topicConfig, logger);
        });

        it('can be instantiated', () => {
            expect(new AwsOutboundChannel(topic)).to.exist;
        });

        it('can get a channel writer', () => {
            const uut = new AwsOutboundChannel(topic);

            expect(uut.writer()).to.exist;
        });

        it('can access underlying topic', () => {
            const uut = new AwsOutboundChannel(topic);
            expect(uut.topic).to.equal(topic);
        });
    });
});
