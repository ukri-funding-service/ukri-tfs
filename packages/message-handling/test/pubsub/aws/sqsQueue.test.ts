import {
    SQSClient,
    ReceiveMessageResult,
    DeleteMessageBatchCommand,
    DeleteMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';
import { expect } from 'chai';
import 'mocha';
import { SqsQueue } from '../../../src/pubsub/aws/sqsQueue';
import sinon, { SinonStub } from 'sinon';
import 'sinon-chai';
import { TfsMessage } from '../../../src/pubsub/message';
import { isTfsMessageObject } from '../../../src/pubsub';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';
import { IsValidPayload } from '../../../src/pollMessages';
import { Decoder, IdentityCodec } from '../../../src/codec/codec';

describe('packages/message-handling - pubsub/aws', () => {
    let sqs: SQSClient;
    let sendStub: SinonStub;
    let logger: Logger;

    beforeEach(() => {
        sqs = new SQSClient({});
        sendStub = sinon.stub(sqs, 'send');
        logger = sinon.spy(new DummyLogger());
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('sqsQueue - basic operations', () => {
        const queueConfig = { queueUrl: 'my-queue-url' };

        it('can be instantiated', () => {
            expect(new SqsQueue(sqs, queueConfig, logger)).itself.exist;
            expect(logger.debug).calledOnce;
        });

        it('can read queue URL', () => {
            const queue = new SqsQueue(sqs, queueConfig, logger);
            expect(queue.url).to.equal(queueConfig.queueUrl);
        });
    });

    describe('sqsQueue - sqs operations', () => {
        const queueConfig = { queueUrl: 'my-queue-url' };

        describe('receiveMessagesFromQueue', () => {
            it('can receive messages when queue is empty', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                const messages = await queue.receiveMessagesFromQueue();

                expect(sendStub).to.be.called;
                expect(messages).to.have.length(0);
            });

            it('can receive messages when queue is populated', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [
                        { MessageId: '1', Body: '{"id": "my-id1", "body":{}}' },
                        { MessageId: '2', Body: '{"id": "my-id2, "body":{}}' },
                        { MessageId: '3', Body: '{"id": "my-id3", "body":{}}' },
                    ],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                const messages = await queue.receiveMessagesFromQueue();

                expect(sendStub).to.be.called;
                expect(messages).to.have.length(3);
            });
        });

        describe('deleteHandledMessages', () => {
            it('can delete messages', async () => {
                const deleteMessageBatchResult: DeleteMessageBatchCommandOutput = {
                    Successful: [{ Id: '0' }, { Id: '1' }],
                    Failed: undefined,
                    $metadata: {},
                };

                sendStub.resolves(deleteMessageBatchResult);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.deleteHandledMessages(['some-handle', 'some-other-handle']);

                expect(sendStub).to.be.calledWith(
                    sinon.match({
                        /* AWS SQS DeleteMessageBatchCommand */
                        input: {
                            QueueUrl: 'my-queue-url',
                            Entries: [
                                { Id: '0', ReceiptHandle: 'some-handle' },
                                { Id: '1', ReceiptHandle: 'some-other-handle' },
                            ],
                        },
                    }),
                );
            });

            it('ignores deletion of empty receipt handle list', async () => {
                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.deleteHandledMessages([]);

                expect(sendStub).to.not.be.called;
            });
        });

        describe('receive<T>', () => {
            it('deletes messages from queue when they are valid TfsMessages and have a receipt handle', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [
                        { MessageId: '1', Body: '{"type": "my-id", "data":{}}', ReceiptHandle: 'some-handle' },
                        { MessageId: '2', Body: '{"type": "my-id2", "data":{}}', ReceiptHandle: 'some-other-handle' },
                    ],
                };

                const deleteMessageBatchResult: DeleteMessageBatchCommandOutput = {
                    Successful: [{ Id: '0' }, { Id: '1' }],
                    Failed: undefined,
                    $metadata: {},
                };

                sendStub.onCall(0).resolves(receivedMessages);
                sendStub.onCall(1).resolves(deleteMessageBatchResult);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.receive<TfsMessage>();

                expect(sendStub).to.be.calledTwice;

                const command = sendStub.getCall(1).args[0];
                expect(command).to.be.instanceof(DeleteMessageBatchCommand);

                const deleteCommandInput = (command as DeleteMessageBatchCommand).input;
                expect(deleteCommandInput.QueueUrl).to.equal(queueConfig.queueUrl);
                expect(deleteCommandInput.Entries![0].ReceiptHandle).to.equal('some-handle');
                expect(deleteCommandInput.Entries![1].ReceiptHandle).to.equal('some-other-handle');
            });

            it('rejects on queue read failures with Error', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await expect(queue.receive<TfsMessage>()).to.be.rejectedWith(Error);
            });

            it('logs queue url on queue read failures', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);

                try {
                    await expect(queue.receive<TfsMessage>());
                } catch (_expected) {
                    /* ignore */
                }

                await expect(logger.error).to.be.calledOnceWith(sinon.match(/my-queue-url/));
            });

            it('logs an error on queue read failures', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);

                try {
                    await expect(queue.receive<TfsMessage>());
                } catch (_expected) {
                    /* ignore */
                }

                await expect(logger.error).to.be.calledOnceWith(sinon.match(/Failed/));
            });

            it('reports failures to delete handled messages', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [
                        { MessageId: '1', Body: '{"type": "my-id", "data":{}}', ReceiptHandle: 'some-handle' },
                        { MessageId: '2', Body: '{"type": "my-id2", "data":{}}', ReceiptHandle: 'some-other-handle' },
                    ],
                };

                const deleteMessageBatchResult: DeleteMessageBatchCommandOutput = {
                    Successful: [{ Id: '0' }],
                    Failed: [{ Id: '1', SenderFault: false, Code: 'some-failure-code' }],
                    $metadata: {},
                };

                sendStub.onCall(0).resolves(receivedMessages);
                sendStub.onCall(1).resolves(deleteMessageBatchResult);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.receive<TfsMessage>();

                expect(sendStub).to.be.calledTwice;
                expect(logger.error).to.be.calledWithMatch(/.*some-failure-code*/);
            });

            it('can receive tfs message body', async () => {
                const message: TfsMessage = {
                    type: 'one',
                    data: {
                        this: 'is my body',
                    },
                };

                const expectedMessage: TfsMessage = {
                    type: message.type,
                    data: message.data,
                };

                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '56', Body: JSON.stringify(message) }],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                const messages = await queue.receive<TfsMessage>();

                expect(messages.length).to.equal(1);
                expect(messages[0]).to.deep.equal(expectedMessage);
                expect(isTfsMessageObject(messages[0])).to.be.true;
            });

            it('can receive body and validate against isValidPayload', async () => {
                interface RandomMessageBody {
                    field1: string;
                    field2: string;
                }

                const message: RandomMessageBody = {
                    field1: 'field1',
                    field2: 'field2',
                };

                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '56', Body: JSON.stringify(message) }],
                };

                sendStub.resolves(receivedMessages);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isValidPayload: IsValidPayload = (payload: any): boolean => {
                    return typeof payload === 'object' && 'field1' in payload && 'field2' in payload;
                };

                const queue = new SqsQueue(sqs, queueConfig, logger);
                const messages = await queue.receive(isValidPayload);

                expect(messages.length).to.equal(1);
                expect(messages[0]).to.deep.equal(message);
            });

            it('logs error and resolves if invalid body is received', async () => {
                const message = {
                    field1: 'field1',
                    field2: 'field2',
                };

                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '56', Body: JSON.stringify(message) }],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receive()).to.eventually.be.fulfilled;
                expect(logger.error).to.have.been.calledWithMatch(/Error during payload validation/);
            });

            it('logs error and resolves if empty message is received', async () => {
                const receivedMessages: ReceiveMessageResult = { Messages: [{ MessageId: '1' }] };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receive()).to.eventually.be.fulfilled;
                expect(logger.error).to.have.been.calledWithMatch(/Error during payload validation/);
            });

            it('does nothing if no messages received', async () => {
                const receivedMessages: ReceiveMessageResult = { Messages: undefined };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receive()).to.eventually.be.fulfilled;
                expect(sendStub).to.have.been.calledOnce;
                expect(logger.error).to.not.have.been.called;
            });

            it('logs error and resolves if explicit null payload is received', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '1', Body: JSON.stringify(null) }],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receive()).to.eventually.be.fulfilled;
                expect(logger.error).to.have.been.calledWithMatch(/Error during payload validation/);
            });
        });

        describe('receiveAndDecode', () => {
            const codec = new IdentityCodec<string>();

            it('deletes messages from queue when they are valid TfsMessages and have a receipt handle', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [
                        { MessageId: '1', Body: '{"type": "my-id", "data":{}}', ReceiptHandle: 'some-handle' },
                        { MessageId: '2', Body: '{"type": "my-id2", "data":{}}', ReceiptHandle: 'some-other-handle' },
                    ],
                };

                const deleteMessageBatchResult: DeleteMessageBatchCommandOutput = {
                    Successful: [{ Id: '0' }, { Id: '1' }],
                    Failed: undefined,
                    $metadata: {},
                };

                sendStub.onCall(0).resolves(receivedMessages);
                sendStub.onCall(1).resolves(deleteMessageBatchResult);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.receiveAndDecode(codec);

                expect(sendStub).to.be.calledTwice;

                const command = sendStub.getCall(1).args[0];
                expect(command).to.be.instanceof(DeleteMessageBatchCommand);

                const deleteCommandInput = (command as DeleteMessageBatchCommand).input;
                expect(deleteCommandInput.QueueUrl).to.equal(queueConfig.queueUrl);
                expect(deleteCommandInput.Entries![0].ReceiptHandle).to.equal('some-handle');
                expect(deleteCommandInput.Entries![1].ReceiptHandle).to.equal('some-other-handle');
            });

            it('rejects on queue read failures with Error', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await expect(queue.receiveAndDecode(codec)).to.be.rejectedWith(Error);
            });

            it('logs queue url on queue read failures', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);

                try {
                    await expect(queue.receiveAndDecode(codec));
                } catch (_expected) {
                    /* ignore */
                }

                await expect(logger.error).to.be.calledOnceWith(sinon.match(/my-queue-url/));
            });

            it('logs an error on queue read failures', async () => {
                sendStub.rejects(new Error('failed to read queue'));

                const queue = new SqsQueue(sqs, queueConfig, logger);

                try {
                    await expect(queue.receiveAndDecode(codec));
                } catch (_expected) {
                    /* ignore */
                }

                await expect(logger.error).to.be.calledOnceWith(sinon.match(/Failed/));
            });

            it('reports failures to delete handled messages', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [
                        { MessageId: '1', Body: '{"type": "my-id", "data":{}}', ReceiptHandle: 'some-handle' },
                        { MessageId: '2', Body: '{"type": "my-id2", "data":{}}', ReceiptHandle: 'some-other-handle' },
                    ],
                };

                const deleteMessageBatchResult: DeleteMessageBatchCommandOutput = {
                    Successful: [{ Id: '0' }],
                    Failed: [{ Id: '1', SenderFault: false, Code: 'some-failure-code' }],
                    $metadata: {},
                };

                sendStub.onCall(0).resolves(receivedMessages);
                sendStub.onCall(1).resolves(deleteMessageBatchResult);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                await queue.receiveAndDecode(codec);

                expect(sendStub).to.be.calledTwice;
                expect(logger.error).to.be.calledWithMatch(/.*some-failure-code*/);
            });

            it('can receive body', async () => {
                const message = {
                    id: 'one',
                    body: {
                        this: 'is my body',
                    },
                };

                const stringifiedBody = JSON.stringify(message);

                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '56', Body: stringifiedBody }],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);
                const messages = await queue.receiveAndDecode(codec);

                expect(messages.length).to.equal(1);
                expect(messages[0]).to.deep.equal(stringifiedBody);
            });

            it('logs error and resolves if invalid body is received', async () => {
                const message = {
                    field1: 'field1',
                    field2: 'field2',
                };

                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '56', Body: JSON.stringify(message) }],
                };

                sendStub.resolves(receivedMessages);

                const decoderThatThrows: Decoder<string, string> = {
                    decode: function (_encodedPayload: string): string {
                        throw new Error('These are not the messages you are looking for.');
                    },
                };
                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receiveAndDecode(decoderThatThrows)).to.eventually.be.fulfilled;
                expect(logger.error).to.have.been.calledWithMatch(/Error during payload decoding/);
            });

            it('resolves if empty message is received', async () => {
                const receivedMessages: ReceiveMessageResult = { Messages: [{ MessageId: '1' }] };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receiveAndDecode(codec)).to.eventually.be.fulfilled;
            });

            it('does nothing if no messages received', async () => {
                const receivedMessages: ReceiveMessageResult = { Messages: undefined };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                await expect(queue.receiveAndDecode(codec)).to.eventually.be.fulfilled;
                expect(sendStub).to.have.been.calledOnce;
                expect(logger.error).to.not.have.been.called;
            });

            it('handles null payload by returning "null"', async () => {
                const receivedMessages: ReceiveMessageResult = {
                    Messages: [{ MessageId: '1', Body: JSON.stringify(null) }],
                };

                sendStub.resolves(receivedMessages);

                const queue = new SqsQueue(sqs, queueConfig, logger);

                const response = await queue.receiveAndDecode(codec);

                expect(response.length).to.equal(1);
                expect(response[0]).to.equal('null');
            });
        });
    });
});
