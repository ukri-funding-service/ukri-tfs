// This module defines the functions used by cucumber steps in
// ../steps/given.js, so that they can be imported into step definitions
// within other modules already using their own instance of cucumber.
//
// It is envisaged this will ultimately be combined with other useful
// shared functions to form a standalone
// library of test utility functions which don't require cucumber,
// so that @ukri-tfs/test-framework can be removed.

const { wipeMailTo } = require('../../shared/mailosaur/wipeMailosaurMailbox.js');
const { clearEntireQueue } = require('../support/messaging/pollSqsQueue.js');

const setRequestBody = function (body) {
    this.request = {
        body,
    };
};

const wipeAllEmailsForEmailAddress = async function (emailAddress, server) {
    await wipeMailTo(emailAddress, server);
};

const wipeAllEmailsForEmailAddresses = async function (server, emailAddresses) {
    await Promise.all(emailAddresses.map(async (emailAddress) => wipeMailTo(emailAddress, server)));
};

const clearQueue = async function (queue) {
    await clearEntireQueue(queue);
};

module.exports = { setRequestBody, wipeAllEmailsForEmailAddress, wipeAllEmailsForEmailAddresses, clearQueue };
