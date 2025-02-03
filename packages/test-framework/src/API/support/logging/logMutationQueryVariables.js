'use strict';

import { log, logLine } from '.';

export const logMutationQueryVariables = (variables) => {
    log.info('Mutation Query Variables ::');
    logLine('Opportunity ID', variables.oppId);
    logLine('Application Name', variables.name);
    log.info('-'.repeat(256));
};
