module.exports = {
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: true,
                tsconfig: 'tsconfig-test.json',
            },
        ],
    },
    testPathIgnorePatterns: ['lib/', 'node_modules/', 'dist/'],
    coveragePathIgnorePatterns: ['lib/', 'node_modules/', 'dist/', 'tests/', 'src/service/adaptor/data/orm/entity'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    verbose: true,
    coverageThreshold: {
        global: {
            branches: -5,
            functions: -6,
            lines: -8,
            statements: -9,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',
    setupFiles: ['./setupJest.js'],
};
