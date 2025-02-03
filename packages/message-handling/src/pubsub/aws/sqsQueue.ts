import {
    DeleteMessageBatchCommand,
    DeleteMessageBatchRequestEntry,
    Message as SQSMessage,
    ReceiveMessageCommand,
    ReceiveMessageCommandInput,
    ReceiveMessageCommandOutput,
    SQSClient,
} from '@aws-sdk/client-sqs';
import { IsValidPayload } from '../../pollMessages';
import { isTfsMessageObject } from '..';
import { Logger } from '../../logger';
import { Decoder } from '../../codec/codec';

function validateMessageBody<T>(fromMessage: SQSMessage, isValidPayload: IsValidPayload = isTfsMessageObject): T {
    const awsMessageId = fromMessage.MessageId;

    const awsBody = fromMessage.Body;
    if (!awsBody) throw new Error(`No Body for message ${awsMessageId}`);

    const parsedBody = JSON.parse(awsBody);

    if (parsedBody === null) {
        throw new Error('Unable to validate message body');
    }

    if (!isValidPayload(parsedBody)) {
        throw new Error('Message contains data in an unknown format');
    }

    return parsedBody as T;
}

export interface SqsQueueConfig {
    queueUrl: string;
}

export class SqsQueue {
    public readonly url: string;

    constructor(private sqsClient: SQSClient, config: SqsQueueConfig, private logger: Logger) {
        this.url = config.queueUrl;
        this.logger.debug(`SqsQueue created with url ${this.url}`);
    }

    async deleteHandledMessages(receiptHandles: Array<string>): Promise<void> {
        if (receiptHandles.length === 0) return;

        const deletionEntries = Array<DeleteMessageBatchRequestEntry>();
        receiptHandles.forEach((handle, index) => deletionEntries.push({ Id: `${index}`, ReceiptHandle: handle }));

        const batchDeletionCommand = new DeleteMessageBatchCommand({
            QueueUrl: this.url,
            Entries: deletionEntries,
        });

        return this.sqsClient.send(batchDeletionCommand).then(response => {
            if (response.Failed && response.Failed.length > 0) {
                this.logger.error(
                    `Failure deleting handled messages from queue ${this.url}: ${JSON.stringify(response.Failed)}`,
                );
            }
        });
    }

    async receiveMessagesFromQueue(): Promise<SQSMessage[]> {
        const command: ReceiveMessageCommandInput = {
            QueueUrl: this.url,
            AttributeNames: ['All'],
            MaxNumberOfMessages: 10,
        };

        const receiveMessageCommand = new ReceiveMessageCommand(command);
        let response: ReceiveMessageCommandOutput;

        try {
            response = await this.sqsClient.send(receiveMessageCommand);
        } catch (queueReadError) {
            this.logger.error(`Failed to read SQS queue with url:${this.url} error:${JSON.stringify(queueReadError)}`);

            throw new Error(`Failed requesting messages from message queue. url:${this.url}`);
        }

        if (response.Messages === undefined) {
            return [];
        }

        return response.Messages;
    }

    async receive<T>(isValidPayload?: IsValidPayload): Promise<T[]> {
        const messages = await this.receiveMessagesFromQueue();

        const handledMessages = new Array<T>();
        const receiptHandlesForDeletion = new Array<string>();

        messages.forEach(sqsMessage => {
            try {
                handledMessages.push(validateMessageBody(sqsMessage, isValidPayload));

                /* Intentionally NOT deleting messages that can't be validated. Implement
                   the queue with a DLQ + redrive policy to avoid repeated failed handling */
                if (sqsMessage.ReceiptHandle) {
                    receiptHandlesForDeletion.push(sqsMessage.ReceiptHandle);
                }
            } catch (validationError) {
                this.logger.error(`Error during payload validation. err=${validationError} payload=${sqsMessage}`);
            }
        });

        if (handledMessages.length) {
            this.logger.info(`Handled ${handledMessages.length} messages on queue ${this.url}`);
        }

        return this.deleteHandledMessages(receiptHandlesForDeletion).then(_ignored => {
            return handledMessages;
        });
    }

    async receiveAndDecode<T>(decoder: Decoder<T, string>): Promise<T[]> {
        const messages = await this.receiveMessagesFromQueue();

        const handledMessages = new Array<T>();
        const receiptHandlesForDeletion = new Array<string>();

        messages.forEach(sqsMessage => {
            if (sqsMessage.Body) {
                try {
                    handledMessages.push(decoder.decode(sqsMessage.Body));

                    /* Intentionally NOT deleting messages with no body. Implement
                       the queue with a DLQ + redrive policy to avoid repeated failed handling */
                    if (sqsMessage.ReceiptHandle) {
                        receiptHandlesForDeletion.push(sqsMessage.ReceiptHandle);
                    }
                } catch (decodeError) {
                    this.logger.error(`Error during payload decoding. err=${decodeError} payload=${sqsMessage}`);
                }
            }
        });

        if (handledMessages.length) {
            this.logger.info(`Handled ${handledMessages.length} messages on queue ${this.url}`);
        }

        return this.deleteHandledMessages(receiptHandlesForDeletion).then(_ignored => {
            return handledMessages;
        });
    }
}
