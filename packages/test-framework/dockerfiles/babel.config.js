module.exports = {
    plugins: ['@babel/plugin-transform-class-properties', '@babel/plugin-transform-runtime'],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 12,
                },
            },
        ],
    ],
};
