module.exports = {
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: true,
            },
        ],
    },
    testPathIgnorePatterns: ['lib/', 'node_modules/', 'dist/'],
    coveragePathIgnorePatterns: ['tests/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    verbose: true,
    globals: {},
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',
};
