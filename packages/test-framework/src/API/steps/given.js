'use strict';

const { Given } = require('@cucumber/cucumber');

// Isolating all the cucumber-based processing here, and extracting the
// functions into a separate lib, is intentional.  This is a step
// to removing cucumber as a dependency from this module.

Given('I clear all the messages from queue {string}', { timeout: 60 * 1000 }, clearQueue);
