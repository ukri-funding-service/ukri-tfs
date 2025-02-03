'use strict';

import { createPaths } from '../../../shared/lib';
const paths = createPaths();

const opts = {
    logFilePath: `${paths.test.api.output.logs}/APIRun.log`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
};

// Remove the word 'File' from createSimpleFileLogger to get console logging.
export const log = require('simple-node-logger').createSimpleFileLogger(opts);
