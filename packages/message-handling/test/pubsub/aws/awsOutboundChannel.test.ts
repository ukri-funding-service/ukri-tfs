/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import 'chai-as-promised';
import { AwsOutboundChannel } from '../../../src/pubsub/aws/awsOutboundChannel';
import { SnsTopic, SnsTopicConfig } from '../../../src/pubsub/aws/snsTopic';
import { Message } from '../../../src/pubsub/message';
import { SNSClient } from '@aws-sdk/client-sns';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import sinon from 'sinon';

describe('packages/message-handling - pubsub/aws/awsOutboundChannel', () => {
    const topicConfig: SnsTopicConfig = {
        topicArn: 'my-topic',
    };
    const logger = new DummyLogger();

    let sns: SNSClient;
    let topic: SnsTopic;

    beforeEach(() => {
        sns = new SNSClient({});
        topic = new SnsTopic(sns, topicConfig, logger);
    });

    it('can be instantiated', () => {
        expect(new AwsOutboundChannel(topic)).to.exist;
    });

    it('can publish a message', () => {
        const uut = new AwsOutboundChannel(topic);

        const message: Message = {
            type: '1',
            data: {
                thisIs: 'a test',
            },
        };

        expect(uut.publish(message)).to.eventually.be.fulfilled;
    });

    it('can access underlying topic', () => {
        const uut = new AwsOutboundChannel(topic);
        expect(uut.topic).to.equal(topic);
    });

    it('rejects if publishRaw rejects', async () => {
        const channel = new AwsOutboundChannel({} as any);

        sinon.stub(channel, 'publishRaw').rejects(new Error('test reject'));

        let err: Error | undefined;

        try {
            await channel.publish({} as any);
        } catch (e) {
            err = e as Error;
        }

        expect(err && err.message).to.equal('test reject');
    });

    it('rejects if topic.publish rejects', async () => {
        const channel = new AwsOutboundChannel({ publish: () => Promise.reject('test reject') } as any);
        let err;

        try {
            await channel.publishRaw('');
        } catch (e) {
            err = e;
        }

        expect(err).to.equal('test reject');
    });
});
