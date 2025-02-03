import { expect } from 'chai';
import { SQSCommand, SQSCommandMessage } from '../../src/sqsCommand/sqsCommand';
import { SQSClient, SendMessageBatchCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import Sinon, { SinonStub } from 'sinon';
import { Logger, TfsMessage } from '../../src';
import { DummyLogger } from '../../src/pubsub/dummy/dummyLogger';

describe('SQSCommand', () => {
    let sqsClient: SQSClient;
    let sqsClientSendStub: SinonStub;
    let loggerSpy: Sinon.SinonSpiedInstance<Logger>;

    beforeEach(() => {
        sqsClient = new SQSClient({});
        sqsClientSendStub = Sinon.stub(sqsClient, 'send');
        loggerSpy = Sinon.spy(new DummyLogger());
    });

    afterEach(() => {
        Sinon.restore();
    });

    it('should construct an instance of SQSCommand and initialise SQSClient with default logger', () => {
        const sqsCommand = new SQSCommand();

        expect(sqsCommand).to.be.instanceOf(SQSCommand);
        expect(sqsCommand.sqsClient).to.be.instanceOf(SQSClient);
        expect(sqsCommand.logger).to.be.instanceOf(DummyLogger);
    });

    it('should construct an instance of SQSCommand with SQS client andlogger', () => {
        const sqsCommand = new SQSCommand(sqsClient, loggerSpy);

        expect(sqsCommand.sqsClient).to.equal(sqsClient);
        expect(sqsCommand.logger).to.equal(loggerSpy);
    });

    describe('send', () => {
        it('should instantiate SendMessageCommand with default message group and deduplication IDs', async () => {
            const sqsCommand = new SQSCommand(sqsClient);

            sqsClientSendStub.resolves();

            const message = buildTfsMessage({
                type: 'my-test-type',
            });
            const sqsCommandMessage: SQSCommandMessage = { Message: JSON.stringify(message) };
            const sqsCommandMessageBody = JSON.stringify(sqsCommandMessage);

            await sqsCommand.send('http://queueurl.com', message);

            expect(sqsClientSendStub).to.be.calledOnce;
            expect(sqsClientSendStub).to.be.calledWith(
                Sinon.match({
                    input: {
                        QueueUrl: 'http://queueurl.com',
                        MessageBody: sqsCommandMessageBody,
                        MessageGroupId: 'my-test-type',
                        MessageDeduplicationId: Sinon.match(/\my-test-type-deduplication-\b/i),
                    },
                }),
            );

            const sendMessageCommand = sqsClientSendStub.getCall(0).args[0];

            expect(sendMessageCommand).to.be.instanceof(SendMessageCommand);
        });
        it('should send command for STANDARD queue without deduplication IDs', async () => {
            const sqsCommand = new SQSCommand(sqsClient);

            sqsClientSendStub.resolves();

            const message = buildTfsMessage({
                type: 'my-test-type',
            });
            const sqsCommandMessage: SQSCommandMessage = { Message: JSON.stringify(message) };
            const sqsCommandMessageBody = JSON.stringify(sqsCommandMessage);

            await sqsCommand.send('http://queueurl.com', message, undefined, undefined, 'STANDARD');

            expect(sqsClientSendStub).to.be.calledOnce;
            expect(sqsClientSendStub).to.be.calledWith(
                Sinon.match({
                    input: {
                        QueueUrl: 'http://queueurl.com',
                        MessageBody: sqsCommandMessageBody,
                    },
                }),
            );

            const sendMessageCommand = sqsClientSendStub.getCall(0).args[0];

            expect(sendMessageCommand).to.be.instanceof(SendMessageCommand);
        });

        it('should use message group and deduplication IDs if supplied', async () => {
            const sqsCommand = new SQSCommand(sqsClient);

            sqsClientSendStub.resolves();

            await sqsCommand.send(
                'http://queueurl.com',
                buildTfsMessage(),
                'message-group-id',
                'message-deduplication-id',
            );

            expect(sqsClientSendStub).to.be.calledWith(
                Sinon.match({
                    input: {
                        MessageGroupId: 'message-group-id',
                        MessageDeduplicationId: Sinon.match(/\message-deduplication-id-\b/i),
                    },
                }),
            );
        });

        it('should throw and log error when sending command to sqs queue fails', async () => {
            const sqsCommand = new SQSCommand(sqsClient, loggerSpy);

            sqsClientSendStub.rejects(new Error('Trigger error'));

            await expect(sqsCommand.send('http://queueurl.com', buildTfsMessage())).to.eventually.be.rejectedWith(
                Error,
                'Trigger error',
            );

            expect(loggerSpy.error).to.be.calledWith(`SQSCommand send failed: Error: Trigger error`);
        });
    });
    describe('sendBatch', () => {
        it('should instantiate SendMessageBatchCommand with default message group and deduplication IDs', async () => {
            const sqsCommand = new SQSCommand(sqsClient);

            sqsClientSendStub.resolves();

            const message = buildTfsMessage({
                type: 'my-test-type',
            });
            const sqsCommandMessage: SQSCommandMessage = { Message: JSON.stringify(message) };
            const sqsCommandMessageBody = JSON.stringify(sqsCommandMessage);
            await sqsCommand.sendBatch('http://queueurl.com', [message]);

            expect(sqsClientSendStub).to.be.calledOnce;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(sqsClientSendStub).to.be.calledWith(
                Sinon.match({
                    input: {
                        QueueUrl: 'http://queueurl.com',
                        Entries: [
                            {
                                Id: Sinon.match(uuidRegex),
                                MessageBody: sqsCommandMessageBody,
                                MessageGroupId: 'my-test-type',
                                MessageDeduplicationId: Sinon.match(/deduplication-\b/i),
                            },
                        ],
                    },
                }),
            );

            const sendMessageCommand = sqsClientSendStub.getCall(0).args[0];

            expect(sendMessageCommand).to.be.instanceof(SendMessageBatchCommand);
        });

        it('should send command for STANDARD queue without deduplication IDs in entries', async () => {
            const sqsCommand = new SQSCommand(sqsClient);

            sqsClientSendStub.resolves();

            const message = buildTfsMessage({
                type: 'my-test-type',
            });
            const sqsCommandMessage: SQSCommandMessage = { Message: JSON.stringify(message) };
            const sqsCommandMessageBody = JSON.stringify(sqsCommandMessage);
            await sqsCommand.sendBatch('http://queueurl.com', [message], 'STANDARD');

            expect(sqsClientSendStub).to.be.calledOnce;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(sqsClientSendStub).to.be.calledWith(
                Sinon.match({
                    input: {
                        QueueUrl: 'http://queueurl.com',
                        Entries: [
                            {
                                Id: Sinon.match(uuidRegex),
                                MessageBody: sqsCommandMessageBody,
                            },
                        ],
                    },
                }),
            );

            const sendMessageCommand = sqsClientSendStub.getCall(0).args[0];

            expect(sendMessageCommand).to.be.instanceof(SendMessageBatchCommand);
        });

        it('should throw and log error when sending command to sqs queue fails', async () => {
            const sqsCommand = new SQSCommand(sqsClient, loggerSpy);

            sqsClientSendStub.rejects(new Error('Trigger error'));

            await expect(
                sqsCommand.sendBatch('http://queueurl.com', [buildTfsMessage()]),
            ).to.eventually.be.rejectedWith(Error, 'Trigger error');

            expect(loggerSpy.error).to.be.calledWith(`SQSCommand send batch failed: Error: Trigger error`);
        });
    });
});

const buildTfsMessage = (tfsMessagePartial: Partial<TfsMessage> = {}): TfsMessage => {
    const defaultTfsMessage: TfsMessage = {
        type: 'test-type',
        correlationIds: {
            parent: 'parent-id',
            current: 'current-id',
            root: 'root-id',
        },
        data: {},
    };

    return {
        ...defaultTfsMessage,
        ...tfsMessagePartial,
    };
};
