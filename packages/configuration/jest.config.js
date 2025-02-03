module.exports = {
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    testPathIgnorePatterns: ['lib/', 'node_modules/', 'dist/'],
    coveragePathIgnorePatterns: ['test/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    verbose: true,
    coverageThreshold: {
        global: {
            branches: -3,
            functions: -6,
            lines: -14,
            statements: -14,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',
};
