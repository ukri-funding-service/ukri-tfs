import { SNSClient } from '@aws-sdk/client-sns';
import { BaseChannelConfig, ChannelFactory } from '../../channel/channelFactory';
import { AwsOutboundChannel } from './awsOutboundChannel';
import { instanceOfSnsFIFOTopicConfig, SnsFIFOTopic, SnsFIFOTopicConfig } from './snsFIFOTopic';
import { SnsTopic, SnsTopicConfig } from './snsTopic';
import { Logger } from '../..';

export interface AwsOutboundChannelConfig extends BaseChannelConfig {
    channelId: string;
    region: string;
    snsTopicConfig: SnsTopicConfig | SnsFIFOTopicConfig;
}

export class AwsOutboundChannelFactory implements ChannelFactory<AwsOutboundChannel> {
    constructor(private snsClient: SNSClient, readonly logger: Logger) {
        this.logger.info(`AwsChannelFactory configured`);
    }

    create(config: AwsOutboundChannelConfig): AwsOutboundChannel {
        if (config.snsTopicConfig.topicArn.length === 0) {
            throw new Error(`Unconfigured topicArn, ${config.snsTopicConfig.topicArn}`);
        }

        let topic: SnsFIFOTopic | SnsTopic;

        if (instanceOfSnsFIFOTopicConfig(config.snsTopicConfig)) {
            this.logger.info(`Instantiating SnsFIFOTopic: ${JSON.stringify(config.snsTopicConfig)}`);

            topic = new SnsFIFOTopic(this.snsClient, config.snsTopicConfig, this.logger);
        } else {
            this.logger.info(`Instantiating SnsTopic: ${JSON.stringify(config.snsTopicConfig)}`);

            topic = new SnsTopic(this.snsClient, config.snsTopicConfig, this.logger);
        }

        this.logger.info(`Instantiating AwsOutboundChannel with channelId ${config.channelId}`);

        return new AwsOutboundChannel(topic);
    }
}
