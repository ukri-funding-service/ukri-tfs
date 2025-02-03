'use strict';

import { log, logLine } from '.';

export const logTables = (tables) => {
    log.info('Tables ::');
    logLine('Tables', tables);
    log.info('-'.repeat(256));
};
