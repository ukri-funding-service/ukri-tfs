'use strict';

import { log, logLine } from '.';

export const logError = (error) => {
    log.info('Error Response ::');
    if (typeof error.body !== 'undefined') {
        logLine('Status Code', error.statusCode);
        logLine('Body', error.body);
    } else if (typeof error.statusMessage !== 'undefined') {
        logLine('Status Message', error.statusMessage);
        logLine('Body', error.body);
    } else {
        logLine('Error', error);
    }
    log.info('-'.repeat(256));
};
