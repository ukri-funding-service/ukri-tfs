const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-knobs'],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.s[ac]ss$/,
            include: [
                path.resolve(__dirname, '../node_modules/govuk-frontend'),
                path.resolve(__dirname, '../src/styles.scss'),
                path.resolve(__dirname, '../src/components'),
                path.resolve(__dirname, '../test/factories'),
            ],
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                },
                'sass-loader',
            ],
        });

        config.module.rules.push({
            test: /\.(jpg|jpeg|png|svg)?$/,
            include: [path.resolve(__dirname, '../images')],
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 800000,
                        outputPath: 'images',
                        name: '[name].[ext]',
                        esModule: false,
                    },
                },
            ],
        });

        config.resolve.alias['core-js/modules'] = path.resolve(__dirname, '..', 'node_modules/core-js/modules');
        config.resolve.alias = {
            ...config.resolve.alias,
            '@ukri-tfs/frontend-utils': path.resolve(__dirname, './mocks/frontendutils.js'),
        };
        config.node = {
            fs: 'empty',
        };

        config.plugins.push(new MiniCssExtractPlugin());
        return config;
    },
};
