/* eslint-disable no-console */
'use strict';

const MailosaurClient = require('mailosaur');
const mailosaur_api_key = process.env.MAILOSAUR_API_KEY || 'NOT_SET';
const mailosaur_server_id = process.env.MAILOSAUR_SERVER_ID || 'NOT_SET';
const client = new MailosaurClient(mailosaur_api_key);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// eslint-disable-next-line default-param-last
const getEmail = async (emailAddress, attempts = 12, debugModeEnabled = false) => {
    let messageId = undefined;

    try {
        for (let attempt = 0; attempt < attempts; attempt++) {
            let waitTime = Math.min(1000 * attempt, 10 * 1000);
            if (waitTime > 0) {
                console.error(
                    `${attempts - attempt} Attempts left, found no email. Waiting ${waitTime}ms and retrying.`,
                );
                await delay(waitTime); // take longer to poll with each attempt
            }

            const result = await getEmailsFromServer(emailAddress);

            if (result !== undefined && result.items !== undefined && result.items.length > 0) {
                messageId = result.items[0].id;
                if (debugModeEnabled) {
                    console.debug(`Retrieved message with id ${messageId}`);
                }
                break;
            }
        }
    } catch (error) {
        console.error(`Error retrieving emails from server for ${emailAddress}: ${error}`);
        throw error;
    }

    if (messageId === undefined) {
        throw new Error(`No message found within ${attempts} attempts for email address ${emailAddress}`);
    }

    return client.messages.getById(messageId);
};

const getEmailsFromServer = async (emailAddress, debugModeEnabled = false) => {
    // Get all emails sent to emailAddress
    const messageListResult = await client.messages.search(mailosaur_server_id, {
        sentTo: emailAddress,
    });

    if (debugModeEnabled) {
        console.debug(`Email search yielded ${messageListResult.items.length}`);
    }

    return messageListResult;
};

module.exports = {
    getEmail,
    getEmailsFromServer,
};
