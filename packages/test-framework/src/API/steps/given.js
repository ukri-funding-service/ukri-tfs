'use strict';

const { Given } = require('@cucumber/cucumber');

const {
    setRequestBody,
    wipeAllEmailsForEmailAddress,
    wipeAllEmailsForEmailAddresses,
    clearQueue,
} = require('../stepFunctions/givenFunctions.js');

// Isolating all the cucumber-based processing here, and extracting the
// functions into a separate lib, is intentional.  This is a step
// to removing cucumber as a dependency from this module.

Given('the request body', setRequestBody);

Given('I wipe all emails to {string} on server {string}', wipeAllEmailsForEmailAddress);

Given('I wipe all emails on server {string} to:', async (server, dataTable) => {
    const emails = dataTable.transpose().raw()[0];
    wipeAllEmailsForEmailAddresses(server, emails);
});

Given('I clear all the messages from queue {string}', { timeout: 60 * 1000 }, clearQueue);
