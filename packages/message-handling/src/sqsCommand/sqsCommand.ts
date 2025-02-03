import {
    SQSClient,
    SendMessageBatchCommand,
    SendMessageBatchCommandInput,
    SendMessageCommand,
    SendMessageBatchRequestEntry,
    SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { Logger } from '../logger';
import { DummyLogger } from '../pubsub/dummy/dummyLogger';
import { v4 as uuidv4 } from 'uuid';

interface CorrelationIds {
    root: string;
    current: string;
    parent?: string;
}

interface TfsMessage<PayloadType = object> {
    type: string;
    data: PayloadType;
    correlationIds?: CorrelationIds;
}

export interface SQSCommandMessage {
    Message: string;
}

type SQSQueueType = 'FIFO' | 'STANDARD';

export class SQSCommand {
    constructor(readonly sqsClient: SQSClient = new SQSClient({}), readonly logger: Logger = new DummyLogger()) {}

    async send(
        queueUrl: string,
        message: TfsMessage,
        messageGroupId?: string,
        messageDeduplicationId?: string,
        queueType: SQSQueueType = 'FIFO',
    ): Promise<void> {
        const sqsCommandMessage: SQSCommandMessage = {
            Message: JSON.stringify(message),
        };

        const sqsCommandMessageBody = JSON.stringify(sqsCommandMessage);

        const uniqueId = uuidv4();
        const commandInput: SendMessageCommandInput = {
            QueueUrl: queueUrl,
            MessageBody: sqsCommandMessageBody,
        };

        if (queueType === 'FIFO') {
            commandInput.MessageGroupId = messageGroupId ?? message.type;
            commandInput.MessageDeduplicationId = messageDeduplicationId
                ? `${messageDeduplicationId}-${uniqueId}`
                : `${message.type}-deduplication-${uniqueId}`;
        }

        const command = new SendMessageCommand(commandInput);

        try {
            await this.sqsClient.send(command);
        } catch (error) {
            this.logger.error(`SQSCommand send failed: ${error}`);
            throw error;
        }
    }

    async sendBatch(queueUrl: string, messages: TfsMessage[], queueType: SQSQueueType = 'FIFO'): Promise<void> {
        const input: SendMessageBatchCommandInput = {
            QueueUrl: queueUrl,
            Entries: messages.map(message => {
                const uniqueId = uuidv4();
                const sqsCommandMessage: SQSCommandMessage = {
                    Message: JSON.stringify(message),
                };
                const commandInput: SendMessageBatchRequestEntry = {
                    Id: uniqueId,
                    MessageBody: JSON.stringify(sqsCommandMessage),
                };

                if (queueType === 'FIFO') {
                    commandInput.MessageGroupId = message.type;
                    commandInput.MessageDeduplicationId = `deduplication-${uniqueId}`;
                }

                return commandInput;
            }),
        };
        const command = new SendMessageBatchCommand(input);

        try {
            await this.sqsClient.send(command);
        } catch (error) {
            this.logger.error(`SQSCommand send batch failed: ${error}`);
            throw error;
        }
    }
}
