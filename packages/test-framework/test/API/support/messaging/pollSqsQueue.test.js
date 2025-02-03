const { expect } = require('chai');
const { SQSClient, PurgeQueueCommand, DeleteMessageCommand, ReceiveMessageCommand } = require('@aws-sdk/client-sqs');
require('mocha');
const sinon = require('sinon');

// Ignored because this is a false positive - only the actual 'aws-sdk' import
// is not allowed
// eslint-disable-next-line deprecate/import
const { mockClient } = require('aws-sdk-client-mock');

const {
    clearEntireQueue,
    removeMessagesFromQueue,
    checkSqsQueueOnce,
} = require('../../../../src/API/support/messaging/pollSqsQueue');

describe('packages/test-framework - API/support/messaging/pollSqsQueue', () => {
    describe('clearEntireQueue', () => {
        let sqsMock;

        beforeEach(() => {
            sqsMock = mockClient(SQSClient);
        });

        it('sends clear queue message via AWS client', async () => {
            await clearEntireQueue('test-queue');

            const purgeCalls = sqsMock.commandCalls(PurgeQueueCommand);
            expect(purgeCalls.length).to.equal(1);
        });

        it('sends expected request AWS client', async () => {
            await clearEntireQueue('test-queue');

            const purgeCalls = sqsMock.commandCalls(PurgeQueueCommand);
            expect(purgeCalls[0].args[0].input).to.deep.equal({ QueueUrl: 'http://sqs:9324/000000000000/test-queue' });
        });
    });

    describe('removeMessagesFromQueue', () => {
        let sqsMock;

        beforeEach(() => {
            sqsMock = mockClient(SQSClient);
        });

        it('sends delete message command via AWS client', async () => {
            const fakeMessage = { receiptHandle: 'some-receipt-handle' };
            await removeMessagesFromQueue(sqsMock, [fakeMessage], 'test-queue');

            const stubConsoleError = sinon.stub(console, 'error');
            const deleteMessageCommands = sqsMock.commandCalls(DeleteMessageCommand);
            stubConsoleError.resetBehavior();

            expect(deleteMessageCommands.length).to.equal(1);
        });

        it('handles message deletion failure', async () => {
            const fakeMessage = { receiptHandle: 'some-receipt-handle' };

            sqsMock.on(DeleteMessageCommand).rejects(new Error('test error'));

            try {
                await removeMessagesFromQueue(sqsMock, [fakeMessage], 'test-queue');
            } catch (err) {
                expect.fail(`Test harness failed to handle error from AWS on message deletion: ${err}`);
            }

            // Don't expect an error here

            const deleteMessageCommands = sqsMock.commandCalls(DeleteMessageCommand);
            expect(deleteMessageCommands.length).to.equal(1);
        });
    });

    describe('checkSqsQueueOnce', () => {
        let sqsMock;

        beforeEach(() => {
            sqsMock = mockClient(SQSClient);
        });

        it('sends receive message command via AWS client', async () => {
            sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

            await checkSqsQueueOnce(sqsMock, 'test-queue');

            const receiveMessageCommands = sqsMock.commandCalls(ReceiveMessageCommand);
            expect(receiveMessageCommands.length).to.equal(1);
        });

        it('returns a message when it is resolved by the AWS command', async () => {
            // For structure of this see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/ReceiveMessageCommand/
            const message = {
                MessageId: 'message-id',
                ReceiptHandle: 'receipt-handle',
                MD5OfBody: 'md5-of-body',
                Body: '{some: "data"}',
            };

            sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [message] });

            const receivedMessages = await checkSqsQueueOnce(sqsMock, 'test-queue');

            expect(receivedMessages.length).to.equal(1);
            expect(receivedMessages[0]).to.deep.equal({
                MessageId: 'message-id',
                ReceiptHandle: 'receipt-handle',
                MD5OfBody: 'md5-of-body',
                Body: '{some: "data"}',
            });
        });

        it('returns multiple messages in order when they are resolved by the AWS command', async () => {
            // For structure of this see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/ReceiveMessageCommand/
            const message1 = {
                MessageId: 'message-id-1',
                ReceiptHandle: 'receipt-handle-1',
                MD5OfBody: 'md5-of-body-1',
                Body: '{some: "data-1"}',
            };
            const message2 = {
                MessageId: 'message-id-2',
                ReceiptHandle: 'receipt-handle-2',
                MD5OfBody: 'md5-of-body-2',
                Body: '{some: "data-2"}',
            };

            sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [message1, message2] });

            const receivedMessages = await checkSqsQueueOnce(sqsMock, 'test-queue');

            expect(receivedMessages.length).to.equal(2);

            expect(receivedMessages[0]).to.deep.equal({
                MessageId: 'message-id-1',
                ReceiptHandle: 'receipt-handle-1',
                MD5OfBody: 'md5-of-body-1',
                Body: '{some: "data-1"}',
            });

            expect(receivedMessages[1]).to.deep.equal({
                MessageId: 'message-id-2',
                ReceiptHandle: 'receipt-handle-2',
                MD5OfBody: 'md5-of-body-2',
                Body: '{some: "data-2"}',
            });
        });
    });
});
