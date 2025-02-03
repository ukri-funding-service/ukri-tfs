'use strict';

const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const { getServiceUrl } = require('./serviceUrl');

const postToSnsTopic = async (topicArn, message, messageGroupId, snsClient = undefined) => {
    if (snsClient === undefined) {
        snsClient = new SNSClient({
            apiVersion: '2010-03-31',
            endpoint: getServiceUrl(9911, 'sns'),
            region: 'eu-west-2',
        });
    }

    const publishCommand = new PublishCommand({
        Message: JSON.stringify(message),
        TopicArn: topicArn,
        MessageGroupId: messageGroupId,
    });

    await snsClient.send(publishCommand);
};

module.exports = { postToSnsTopic };
