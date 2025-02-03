#!/usr/bin/env node

const { execSync } = require('child_process');
const yargs = require('yargs');

const config = require('../config');

const { createPaths } = require('../shared/lib/createPaths');
const paths = createPaths();

const scripts = () =>
    config.scripts.forEach(
        ({ name, description, command }) =>
            yargs
                .command(name, description, () => {
                    try {
                        let cmd = command;
                        cmd = cmd.replace(/%cucumber-js%/g, `${paths.nodeModules}/.bin/cucumber-js`);
                        cmd = cmd.replace(/%wdio%/g, `${paths.framework.nodeModules}/.bin/wdio`);
                        cmd = cmd.replace(/%framework%/g, `${paths.framework.root}`);
                        cmd = cmd.replace(/%frameworkApiHooks%/g, `${paths.framework.api.hooks}`);
                        cmd = cmd.replace(/%frameworkApiSteps%/g, `${paths.framework.api.steps}`);
                        cmd = cmd.replace(/%frameworkScripts%/g, `${paths.framework.scripts}`);
                        cmd = cmd.replace(/%test%/g, `${paths.test.root}`);
                        cmd = cmd.replace(/%testApiOutputReports%/g, `${paths.test.api.output.reports}`);
                        cmd = cmd.replace(/%testApiFeatures%/g, `${paths.test.api.features}`);
                        cmd = cmd.replace(/%testApiSteps%/g, `${paths.test.api.steps}`);
                        cmd = cmd.replace(/%testUIConfig%/g, `${paths.framework.ui.config}`);

                        // eslint-disable-next-line no-console
                        console.info(`Test execution: ${cmd}`);

                        execSync(cmd, {
                            stdio: 'inherit',
                        });
                    } catch (err) {
                        console.error(JSON.stringify(err, null, 4));
                        process.exit(err.status);
                    }
                })
                .help().argv,
    );

module.exports = scripts;
