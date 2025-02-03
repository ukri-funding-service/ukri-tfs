'use strict';

import { log, logLine } from '.';

export const logResponse = (response) => {
    const emptyResponse =
        (typeof response.statusCode === 'undefined' || response.statusCode === '') &&
        (typeof response.body === 'undefined' || response.body === '');

    if (emptyResponse) return;

    log.info('Response ::');
    logLine('Status', response.statusCode);
    logLine('Body', response.body);
    log.info('-'.repeat(256));
};
