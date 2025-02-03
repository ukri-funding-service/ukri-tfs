// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    _comment:
        "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'jest',
    checkers: ['typescript'],
    tsconfigFile: 'tsconfig.json',
    testRunner_comment:
        'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
    coverageAnalysis: 'perTest',
    concurrency: 2,
    appendPlugins: ['@stryker-mutator/jest-runner', '@stryker-mutator/typescript-checker'],
    ignorePatterns: ['lib/*/'],
};
export default config;
