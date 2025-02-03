'use strict';

const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs');
const { createPaths } = require('./createPaths');
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

// Grab logSteamNames from AWS that fall within the period of our generated timestamp when request was made
const getStreamName = async (logGroupName, timestamp, cwlClient = undefined) => {
    const streamArray = [];
    const describeLogStreamsCommand = new DescribeLogStreamsCommand({
        logGroupName,
        descending: true,
        orderBy: 'LastEventTime',
    });

    if (cwlClient === undefined) {
        cwlClient = new CloudWatchLogsClient({
            region: 'eu-west-2',
        });
    }

    const data = await cwlClient.send(describeLogStreamsCommand);

    data.logStreams.forEach((element) => {
        if (timestamp > element.firstEventTimestamp && timestamp < element.lastIngestionTime) {
            streamArray.push(element);
        }
    });

    return streamArray;
};

// Return all the messages found in the StreamNames from getStreamName()
const getEventLog = async (logGroupName, timestamp, cwlClient = undefined) => {
    if (cwlClient === undefined) {
        cwlClient = new CloudWatchLogsClient({
            region: 'eu-west-2',
        });
    }

    const logStreamNames = await getStreamName(logGroupName, timestamp, client);
    const allLogMessages = [];

    for (const element of logStreamNames) {
        let data = await cwlClient.send(
            new GetLogEventsCommand({
                logGroupName,
                logStreamName: element.logStreamName,
            }),
        );

        data.events.forEach((el) => {
            allLogMessages.push(el);
        });
    }

    return allLogMessages;
};

// Getting the current correlation ID from the latest log message matching our search string
const getCurrent = async (logsWithId) => {
    let regex = /Current:(.*:)/;
    const message = logsWithId[0].message.match(regex);
    variables.currentId = message[1].slice(0, -1);
};

// Checks the resulting array to see if our expected string is found in any of the log messages
export const findCorrelationID = async (logString, logGroupName, timestamp, cwlClient = undefined) => {
    if (cwlClient === undefined) {
        cwlClient = new CloudWatchLogsClient({
            region: 'eu-west-2',
        });
    }

    const logMessages = await getEventLog(logGroupName, timestamp, cwlClient);

    let logsWithId = logMessages
        .filter((element) => element.message.includes(logString))
        .sort(function (a, b) {
            return a.timestamp < b.timestamp ? -1 : 1;
        })
        .reverse();

    if (logsWithId.length > 0) {
        await getCurrent(logsWithId);
    }

    return logsWithId;
};

// Checks the resulting array to see if our expected string is found in any of the log messages
export const findLambdaLog = async (logString, logGroupName, timestamp, cwlClient = undefined) => {
    if (cwlClient === undefined) {
        cwlClient = new CloudWatchLogsClient({
            region: 'eu-west-2',
        });
    }

    const logMessages = await getEventLog(logGroupName, timestamp, cwlClient);

    let logsWithId = logMessages
        .filter((element) => element.message.includes(logString))
        .sort(function (a, b) {
            return a.timestamp < b.timestamp ? -1 : 1;
        })
        .reverse();

    return logsWithId;
};
