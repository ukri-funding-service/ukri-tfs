const { expect } = require('chai');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
require('mocha');

// Ignored because this is a false positive - only the actual 'aws-sdk' import
// is not allowed
// eslint-disable-next-line deprecate/import
const { mockClient } = require('aws-sdk-client-mock');

const { postToSnsTopic } = require('../../../../src/API/support/messaging/postToSnsTopic');

describe('packages/test-framework - API/support/messaging/postToSnsTopic', () => {
    describe('postToSnsTopic', () => {
        let snsMock;

        beforeEach(() => {
            snsMock = mockClient(SNSClient);
        });

        it('sends publish message via AWS client', async () => {
            const testMessage = { thisIsSomeData: 'to validate the message sending request' };
            await postToSnsTopic('test-topic-arn', testMessage, 'test-message-group-id');

            const publishCommands = snsMock.commandCalls(PublishCommand);
            expect(publishCommands.length).to.equal(1);
        });

        it('sends the expected data to AWS client', async () => {
            const testMessage = { thisIsSomeData: 'to validate the message sending request' };
            await postToSnsTopic('test-topic-arn', testMessage, 'test-message-group-id');

            const publishCommands = snsMock.commandCalls(PublishCommand);

            expect(publishCommands[0].firstArg.input).to.deep.equal({
                Message: '{"thisIsSomeData":"to validate the message sending request"}',
                MessageGroupId: 'test-message-group-id',
                TopicArn: 'test-topic-arn',
            });
        });
    });
});
