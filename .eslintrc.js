module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    plugins: ['@typescript-eslint', 'deprecate', 'node', 'unused-imports', 'mocha'],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    rules: {
        eqeqeq: 'warn',
        complexity: ['warn', 15], // aligns with sonarqube - will be reduced in the future
        'no-console': ['error', { allow: ['warn', 'error'] }], // console.log not allowed, permit warn or error
        'no-return-await': 'warn',
        'no-fallthrough': 'warn',
        'no-nested-ternary': 'error',
        'default-param-last': 'warn',
        '@typescript-eslint/no-shadow': 'warn',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],

        // The following should be removed post mono repository sanitisation
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/camelcase': 'off',

        'mocha/no-skipped-tests': 'error',
        'mocha/no-exclusive-tests': 'error',

        // This rule says services can't include parts of each other
        'no-restricted-imports': [
            'error',
            {
                patterns: ['**/src/**', '**/dist/**', '!@ukri-tfs/**/src/**', '!@ukri-tfs/**/dist/**'],
            },
        ],

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        // Prefer typescript version for consistency https://typescript-eslint.io/rules/no-unused-vars/
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],

        // No indirect dependencies, thanks.
        'node/no-extraneous-import': [
            'error',
            {
                allowModules: [
                    'ajv', // This package is best managed indirectly via the 'fastify' package.
                    'body-parser', // This package is best managed indirectly via the 'express' package.
                    'jest-mock', // This package is best managed indirectly via the 'jest' package.
                    'expect-webdriverio', // This package is best managed via '@wdio/cucumber-framework'.
                    // devDependencies are fine.  And anyway, these get flagged because they bubble up from root,
                    // not because they are indirect.
                    'chai',
                    'chai-as-promised',
                    'enzyme',
                    'fetch-mock',
                    'ignore-styles',
                    'jsdom',
                    'mocha',
                    'sinon',
                    'sinon-chai',
                ],
            },
        ],

        /* 'node/no-process-env': 'warn',  // disabled until means to disarm for tests is found */

        'deprecate/import': [
            'warn',
            // If your awk import doesn't start @aws-sdk you're using an out of date package!
            // (e.g. @aws-sdk/s3-client, @aws-sdk/ses, @aws-sns.  NOT aws-sdk)
            { nameRegExp: '^aws-sdk*' },
            { name: 'enzyme', use: '@testing-library/react' },
        ],
        'deprecate/function': [
            'warn',
            {
                name: 'createDataSource',
                use: 'createTestDataSource',
                message: 'createDataSource is deprecated. Use createTestDataSource instead.',
            },
            {
                name: 'toBeCalledWith',
                use: 'toHaveBeenCalledWith',
                message: 'toBeCalledWith is deprecated. Use toHaveBeenCalledWith instead.',
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                format: null,
                selector: 'default',
                custom: {
                    regex: '(panelist|Panelist|PANELIST)', // we're spelling it 'panellist'
                    match: false,
                },
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                format: null,
                selector: 'default',
                custom: {
                    regex: '(useable|Useable|USEABLE)', // we're spelling it 'usable'
                    match: false,
                },
            },
        ],
        'no-restricted-syntax': [
            'warn',
            {
                selector: 'Literal[value=/localhost/i]',
                message: 'localhost is ambiguous, prefer explicit 127.0.0.1 for IPv4',
            },
        ],
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 0,
                '@typescript-eslint/explicit-module-boundary-types': ['error'],
                '@typescript-eslint/ban-types': 0,
                'no-unused-vars': 'off', // This is covered by @typescript-eslint/no-unused-vars for TS files
            },
        },
        {
            // disable rules specifically for test folders
            files: ['**/test/**/*.ts', '**/test/**/*.tsx', '**/tests/**/*.ts', '**/tests/**/*.tsx'],
            rules: {
                'no-restricted-imports': 'off',
            },
        },
        {
            // disable localhost rule outside code directories
            files: ['.eslintrc.js'],
            rules: {
                'no-restricted-syntax': 'off',
            },
        },
    ],
};
