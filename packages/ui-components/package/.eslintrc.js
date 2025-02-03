module.exports = {
    extends: ['../../../.eslintrc.js', 'plugin:react/recommended'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/prop-types': 'off',
        'react/jsx-key': 'warn',
    },
};
