'use strict';

import { log, logLine } from '.';

export const logGraphQLRequest = (url, headers, query, variables) => {
    log.info('GraphQL Request ::');
    logLine('URL', url);
    logLine('Headers', headers);
    logLine('Query', query);
    logLine('Variables', variables);
    log.info('-'.repeat(256));
};
