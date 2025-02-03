'use strict';

import { log } from '.';

export const logLine = (title, variable) => {
    let updatedVariable;

    const variableType = typeof variable;

    updatedVariable = variableType === 'undefined' ? 'Not Specified.' : variable;
    updatedVariable = variable === '' ? 'Empty String.' : updatedVariable;

    if (variableType === 'string' && variable.substring(0, 1) === '{') {
        try {
            updatedVariable = JSON.parse(variable);
        } catch {
            updatedVariable = variable;
        }
    }

    const paddedTitle = `${title.padStart(18, ' ')} :`;

    if (typeof updatedVariable === 'object' && updatedVariable !== null) {
        if (Object.keys(updatedVariable).length <= 1) {
            log.info(`${paddedTitle} ${JSON.stringify(updatedVariable)}`);
        } else {
            log.info(`${paddedTitle}\n${JSON.stringify(updatedVariable, null, 4)}`);
        }
    } else {
        log.info(`${paddedTitle} ${updatedVariable}`);
    }
};
