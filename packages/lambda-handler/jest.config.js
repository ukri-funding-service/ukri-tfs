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
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testResultsProcessor: './node_modules/jest-junit-reporter',

    setupFiles: ['./test/setupJest.js'],
};
