/*
 * Jest config file for extending the default config to enable report generation.
 * This is _considerably_ slower than running without and is intended for CI execution
 * where log files are required.
 *
 * To execute jest with this configuration include "--config <filename>" on the jest cli.
 *
 * See README.test.md
 */

const defaultConfig = require('./jest.config.js'); // include the standard config

/** @type {import('jest').Config} */
const config = {
    ...defaultConfig,
    reporters: [['jest-junit', { outputDirectory: 'test_reports', outputName: 'junit.xml' }], 'summary'],
};

module.exports = config;
