import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import {
    AwsInboundChannel,
    AwsOutboundChannel,
    instanceOfSnsFIFOTopicConfig,
    SnsFIFOTopic,
    SqsQueue,
    SqsQueueConfig,
} from '.';
import {
    ChannelFactory,
    CombinedChannelConfig,
    InboundChannel,
    InboundChannelConfig,
    OutboundChannel,
    OutboundChannelConfig,
    SnsFIFOTopicConfig,
} from '..';
import { Logger } from '../../logger';
import { SnsTopic, SnsTopicConfig } from './snsTopic';

export interface AwsInboundChannelConfig extends InboundChannelConfig {
    sqsQueueConfig: SqsQueueConfig;
}

export interface AwsOutboundChannelConfig extends OutboundChannelConfig {
    snsTopicConfig: SnsTopicConfig | SnsFIFOTopicConfig;
}

export interface AwsChannelConfig extends CombinedChannelConfig {
    inbound: AwsInboundChannelConfig[];
    outbound: AwsOutboundChannelConfig[];
}

export interface AwsChannelFactoryConfig {
    region: string;
    channels: AwsChannelConfig;
}

export class AwsChannelFactory implements ChannelFactory {
    private inboundChannelConfig: Map<string, SqsQueueConfig> = new Map();
    private outboundChannelConfig: Map<string, SnsTopicConfig | SnsFIFOTopicConfig> = new Map();

    constructor(
        config: AwsChannelConfig,
        private sqsClient: SQSClient,
        private snsClient: SNSClient,
        readonly logger: Logger,
    ) {
        config.inbound.forEach(inboundConfig => {
            this.inboundChannelConfig.set(inboundConfig.channelId, inboundConfig.sqsQueueConfig);
        });

        config.outbound.forEach(outboundConfig => {
            this.outboundChannelConfig.set(outboundConfig.channelId, outboundConfig.snsTopicConfig);
        });

        this.logger.info(
            `AwsChannelFactory configured with ${this.inboundChannelConfig.size} inbound channels and ${this.outboundChannelConfig.size} outbound channels`,
        );
    }

    newInboundChannel(channelId: string): InboundChannel {
        if (!this.inboundChannelConfig.has(channelId)) {
            throw new Error(`Unconfigured inbound channel ${channelId}`);
        }

        const queueConfig = this.inboundChannelConfig.get(channelId)!;

        return new AwsInboundChannel(new SqsQueue(this.sqsClient, queueConfig, this.logger));
    }

    newOutboundChannel(channelId: string): OutboundChannel {
        if (!this.outboundChannelConfig.has(channelId)) {
            throw new Error(`Unconfigured outbound channel ${channelId}`);
        }

        const config = this.outboundChannelConfig.get(channelId)!;

        if (config.topicArn.length === 0) {
            throw new Error(`Unconfigured topicArn, ${config.topicArn}`);
        }

        if (instanceOfSnsFIFOTopicConfig(config)) {
            return new AwsOutboundChannel(new SnsFIFOTopic(this.snsClient, config, this.logger));
        }

        return new AwsOutboundChannel(new SnsTopic(this.snsClient, config, this.logger));
    }
}
