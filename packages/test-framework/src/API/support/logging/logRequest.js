'use strict';

import { log, logLine } from '.';

export const logRequest = (requestVariables, options = '') => {
    log.info('Request ::');
    logLine('URL', requestVariables.httpRequestUrl);
    logLine('Method', options.method);
    logLine('Headers', options.headers);
    logLine('Content Type', options['Content-Type']);
    logLine('Response Type', options.responseType);
    logLine('Body', options.body);
    logLine('JSON', options.json);
    log.info('-'.repeat(256));
};
