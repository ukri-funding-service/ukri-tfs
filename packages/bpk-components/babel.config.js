module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-export-default-from',
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 18,
                },
            },
        ],
    ],
};
