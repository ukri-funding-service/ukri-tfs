import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';
import { SnsTopic, SnsTopicConfig } from './snsTopic';
import { Logger } from '../../logger';

export interface SnsFIFOTopicConfig extends SnsTopicConfig {
    isFIFO: true;
    groupId?: string;
}

export function instanceOfSnsFIFOTopicConfig(object: unknown): object is SnsFIFOTopicConfig {
    return (
        object !== null &&
        typeof object === 'object' &&
        'isFIFO' in object! &&
        (object as SnsFIFOTopicConfig).isFIFO === true
    );
}

export class SnsFIFOTopic extends SnsTopic {
    private readonly groupId?: string;

    constructor(sns: SNSClient, config: SnsFIFOTopicConfig, logger: Logger) {
        super(sns, config, logger);
        this.groupId = config.groupId;
        this.logger.debug(`SnsFIFO config: group=${this.groupId}`);
    }

    async publish(data: string): Promise<void> {
        const config: PublishCommandInput = {
            Message: data, // Max 1600 chars - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/interfaces/publishcommandinput.html
            TopicArn: this.topicArn,
        };

        if (this.groupId) {
            config.MessageGroupId = this.groupId;
        }

        const publishCommand = new PublishCommand(config);

        await this.sns
            .send(publishCommand)
            .then(result => {
                this.logger.info(
                    `Transmitted message with id ${result.MessageId}, sequence number ${result.SequenceNumber}, on FIFO topic with arn ${this.arn}, group ${this.groupId}`,
                );
                this.logger.debug(
                    `Message with id ${result.MessageId} had metadata: ${JSON.stringify(result.$metadata)}`,
                );
            })
            .catch(error => {
                this.logger.error(
                    `Error transmitting on FIFO topic with arn ${this.arn}, group ${this.groupId}.  Error: ${error}`,
                );
                throw error;
            });
    }
}
