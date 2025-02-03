'use strict';

import { log, logLine } from '.';

export const logGraphQLResponse = (response) => {
    const isEmptyResponse = typeof response === 'undefined' || response === '';

    if (isEmptyResponse) return;

    log.info('Response ::');
    logLine('Status', response.status);
    logLine('Body', response);
    log.info('-'.repeat(256));
};
