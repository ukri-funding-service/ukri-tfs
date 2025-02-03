'use strict';

import { log, logLine } from '.';

export const logQuestionSet = (questionSet) => {
    log.info('Question Set ::');
    logLine('ID', questionSet.id);
    logLine('Is Complete', questionSet.isComplete);
    logLine('Questions', questionSet.questions);
    log.info('-'.repeat(256));
};
