module.exports = {
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    testPathIgnorePatterns: ['node_modules/', 'dist/'],
    coveragePathIgnorePatterns: ['test/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    verbose: true,
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',
};
