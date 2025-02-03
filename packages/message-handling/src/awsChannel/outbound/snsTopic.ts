import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';
import { Topic } from '../../pubsub/topic';
import { Logger } from '../../logger';

export interface SnsTopicConfig {
    topicArn: string;
}

export class SnsTopic implements Topic {
    protected readonly topicArn: string;

    get name(): string {
        return this.topicArn;
    }

    get arn(): string {
        return this.topicArn;
    }

    constructor(protected sns: SNSClient, config: SnsTopicConfig, protected logger: Logger) {
        this.topicArn = config.topicArn;
        this.logger.debug(`SnsTopic config: arn=${this.arn}`);
    }

    async publish(data: string): Promise<void> {
        const config: PublishCommandInput = {
            Message: data, // This has a fixed size limit (256KB at time of writing) - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/interfaces/publishcommandinput.html
            TopicArn: this.topicArn,
        };

        const publishCommand = new PublishCommand(config);

        await this.sns
            .send(publishCommand)
            .then(result => {
                this.logger.info(`Transmitted message with id ${result.MessageId} on topic with arn ${this.arn}`);
                this.logger.debug(
                    `Message with id ${result.MessageId} had metadata: ${JSON.stringify(result.$metadata)}`,
                );
            })
            .catch(error => {
                this.logger.error(`Error transmitting on topic with arn ${this.arn}.  Error: ${error}`);
                throw error;
            });
    }
}
