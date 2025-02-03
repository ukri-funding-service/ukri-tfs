import { SQSClient } from '@aws-sdk/client-sqs';
import { DummyLogger } from '../../pubsub/dummy/dummyLogger';
import { BaseChannelConfig, ChannelFactory } from '../../channel/channelFactory';
import { AwsInboundChannel } from './awsInboundChannel';
import { SqsQueueConfig, SqsQueue } from './sqsQueue';
import { Logger } from '../..';

export interface AwsInboundChannelConfig extends BaseChannelConfig {
    channelId: string;
    sqsQueueConfig: SqsQueueConfig;
}

export class AwsInboundChannelFactory implements ChannelFactory<AwsInboundChannel> {
    constructor(private sqsClient: SQSClient, readonly logger: Logger = new DummyLogger()) {
        this.logger.info(`AwsChannelFactory configured`);
    }

    create(config: AwsInboundChannelConfig): AwsInboundChannel {
        this.logger.info(`Instantiating SqsQueue with config: ${JSON.stringify(config.sqsQueueConfig)}`);
        const queue = new SqsQueue(this.sqsClient, config.sqsQueueConfig, this.logger);

        this.logger.info(`Instantiating AwsInboundChannel for channelId ${config.channelId}`);
        return new AwsInboundChannel(queue);
    }
}
