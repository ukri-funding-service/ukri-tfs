'use strict';

const MailosaurClient = require('mailosaur');
const mailosaur_api_key = process.env.MAILOSAUR_API_KEY || 'NOT_SET';
const mailosaur_server_id = process.env.MAILOSAUR_SERVER_ID || 'NOT_SET';
const client = new MailosaurClient(mailosaur_api_key);

async function wipeMailosaurMailbox() {
    await client.messages.deleteAll(mailosaur_server_id);
}

async function wipeMailTo(emailAddress, server) {
    const emailIdsForDeletion = await messageIdsTo(emailAddress, server);
    for (let i = 0; i < emailIdsForDeletion.length; i++) {
        await client.messages.del(emailIdsForDeletion[i]);
    }
}

async function messageIdsTo(emailAddress, server) {
    const allEmails = (
        await client.messages.search(server, {
            sentTo: emailAddress,
            itemsPerPage: 1000,
        })
    ).items;
    return allEmails.map((email) => email.id);
}

module.exports = { wipeMailTo, wipeMailosaurMailbox, messageIdsTo };
