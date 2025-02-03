'use strict';

const MailosaurClient = require('mailosaur');
const mailosaur_api_key = process.env.MAILOSAUR_API_KEY || 'NOT_SET';
const mailosaur_server_id = process.env.MAILOSAUR_SERVER_ID || 'NOT_SET';

const client = new MailosaurClient(mailosaur_api_key);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let attempts = 12;

const getEmails = async function (emailAddress) {
    let messageId = '';

    await getEmailsFromServer(emailAddress)
        .then(async (result) => {
            messageId = await checkResultOrRetry(result, emailAddress);
        })
        .catch((error) => {
            console.error('Error retrieving emails from server: ' + error);
            throw error;
        });
    if (typeof messageId !== 'undefined') {
        // If email is found, pass data onto global context for next steps
        browser.receivedEmail = await client.messages.getById(messageId).catch((error) => {
            console.error('Error retrieving email by ID: ' + error);
            throw error;
        });
        // eslint-disable-next-line no-console
        console.log('Retrieved email: ' + JSON.stringify(browser.receivedEmail));
        // Delete found email from the mailbox
        await client.messages.del(messageId);
    }
};

async function getEmailsFromServer(emailAddress) {
    // Get all emails for that emailAddress
    return client.messages.search(mailosaur_server_id, {
        sentTo: emailAddress,
    });
}

async function checkResultOrRetry(result, emailAddress) {
    if (!result.items || (!result.items[0] && attempts > 0)) {
        --attempts;
        console.error(attempts + ' Attempts left, found no email. Waiting 10 seconds and retrying.');
        await delay(10000);
        await getEmails(emailAddress);
    } else if (attempts === 0) {
        // Error as no emails found after 6 attempts
        throw new Error('Email not found on the server');
    } else {
        // Return the latest email from list of all emails
        return result.items[0].id;
    }
}

module.exports = { getEmails };
