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
            branches: -12,
            functions: -8,
            lines: -7,
            statements: -8,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',
};
