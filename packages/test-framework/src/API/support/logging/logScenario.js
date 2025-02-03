'use strict';

import { log } from '.';

import { createPaths } from '../../../shared/lib';
const paths = createPaths();

export const logScenario = (scenarioPath, scenarioName) => {
    const scenarioFile = scenarioPath.replace(paths.test.root, '');

    let scenarioFileOffset = 192 - scenarioFile.length;
    let scenarioNameOffset = 192 - scenarioName.length;

    scenarioFileOffset = scenarioFileOffset < 0 ? 0 : scenarioFileOffset;
    scenarioNameOffset = scenarioNameOffset < 0 ? 0 : scenarioNameOffset;

    log.info(' ');
    log.info('='.repeat(256));
    log.info(`==== Scenario File ==== ${scenarioFile}${' '.repeat(scenarioFileOffset)} ==== Scenario File ====`);
    log.info(`==== Scenario Name ==== ${scenarioName}${' '.repeat(scenarioNameOffset)} ==== Scenario Name ====`);
    log.info('='.repeat(256));
};
