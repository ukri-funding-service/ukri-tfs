/*
 * Jest common config
 * NOTE: do not enable reporters in this file without considering the performance impact.
 *
 * See README.test.js for details.
 */
const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
config = {
    transform: {
        ...tsjPreset.transform,
        '^.+\\.tsx?$': ['ts-jest', { tsConfig: 'tsconfig-test.json' }],
    },
    testPathIgnorePatterns: ['lib/', 'node_modules/', 'dist/'],
    coveragePathIgnorePatterns: ['tests/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};

module.exports = config;
