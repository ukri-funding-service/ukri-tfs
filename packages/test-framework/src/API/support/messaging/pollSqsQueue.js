'use strict';

const { SQSClient, PurgeQueueCommand, DeleteMessageCommand, ReceiveMessageCommand } = require('@aws-sdk/client-sqs');

const { getServiceUrl } = require('./serviceUrl');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const local_sqs_endpoint = getServiceUrl(9324, 'sqs');

// recursively checks to see if all properties defined in matcher exist and have the same value in object
const partialMatch = (object, matcher) => {
    return Object.keys(matcher).every((key) => {
        const matcherProperty = matcher[key];
        const objectProperty = object[key];
        if (matcherProperty && objectProperty) {
            return matcherProperty instanceof Object
                ? partialMatch(objectProperty, matcherProperty)
                : matcherProperty === objectProperty;
        }
        return false;
    });
};

const checkSqsQueueOnce = async (sqsClient, queue) => {
    const data = await sqsClient.send(
        new ReceiveMessageCommand({
            QueueUrl: generateFullQueueURL(queue),
            AttributeNames: ['All'],
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 1, // Message is hidden from other requests for max 1s
        }),
    );

    return data.Messages || [];
};

const removeMessagesFromQueue = async (sqsClient, messages, queue, debugModeEnabled = false) => {
    for (const message of messages) {
        try {
            await sqsClient.send(
                new DeleteMessageCommand({
                    QueueUrl: generateFullQueueURL(queue),
                    ReceiptHandle: message.ReceiptHandle,
                }),
            );

            if (debugModeEnabled) {
                // eslint-disable-next-line no-console
                console.log('Removed message from queue');
            }
        } catch (err) {
            console.error(`Error removing messages from queue: ${queue}`);
            console.error(err, err.stack);
        }
    }
};

const generateFullQueueURL = (queue) => {
    return `${local_sqs_endpoint}/000000000000/${queue}`;
};

const clearEntireQueue = async (queue, sqsClient = undefined) => {
    if (sqsClient === undefined) {
        sqsClient = new SQSClient({ apiVersion: '2012-11-05', endpoint: local_sqs_endpoint, region: 'eu-west-2' });
    }

    try {
        await sqsClient.send(
            new PurgeQueueCommand({
                QueueUrl: generateFullQueueURL(queue),
            }),
        );
    } catch (err) {
        console.error(`Error purging queue: ${queue}`);
        console.error(err, err.stack);

        if (err['$response'] !== undefined) {
            console.error(err.$response);
        }
    }

    await delay(1000);
};

const parseMessageBody = (message) => {
    if (message === undefined) {
        console.error(`Message was undefined`);
        return undefined;
    }

    if (message.Body === undefined) {
        console.error(`Contents of message body were undefined`);
        return undefined;
    }

    try {
        return JSON.parse(message.Body);
    } catch (error) {
        console.error(`Failed to parse contents of message.Body as JSON: ${message.Body}`);
        throw error;
    }
};

const checkSqsQueue = async (
    queue,
    matcher = false,
    failOnEmpty = true,
    attempts = 10,
    sqsClient = undefined,
    debugModeEnabled = false,
) => {
    if (sqsClient === undefined) {
        sqsClient = new SQSClient({ apiVersion: '2012-11-05', endpoint: local_sqs_endpoint, region: 'eu-west-2' });
    }

    let matchedMessages = [];

    for (let attempt = attempts; attempt > 0; attempt--) {
        const messages = await checkSqsQueueOnce(sqsClient, queue);

        if (debugModeEnabled) {
            // eslint-disable-next-line no-console
            console.log(`Checking ${messages.length} messages found on queue for match`);
        }

        matchedMessages = messages.filter((message) => {
            const body = parseMessageBody(message);
            const matched = body !== undefined ? partialMatch(body, matcher) : false;

            if (!matched && debugModeEnabled) {
                // eslint-disable-next-line no-console
                console.log('Found unmatched message:', body);
            }

            return matched;
        });

        if (matchedMessages.length > 0) {
            if (debugModeEnabled) {
                // eslint-disable-next-line no-console
                console.log(`Found ${matchedMessages.length} matching messages`);
            }

            break;
        }

        await delay(1000);
    }

    await removeMessagesFromQueue(sqsClient, matchedMessages, queue);

    if (failOnEmpty && !matchedMessages.length) {
        throw new Error(`No matching SQS messages found in requested queue: ${queue}.`);
    }

    return matchedMessages;
};

module.exports = { checkSqsQueue, clearEntireQueue, removeMessagesFromQueue, checkSqsQueueOnce };
