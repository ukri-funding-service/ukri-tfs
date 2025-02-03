const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts)$/,
                include: [
                    /bpk-component-breakpoint/,
                    /bpk-component-calendar/,
                    /bpk-component-close-button/,
                    /bpk-component-datepicker/,
                    /bpk-component-icon/,
                    /bpk-component-input/,
                    /bpk-component-link/,
                    /bpk-component-modal/,
                    /bpk-component-navigation-bar/,
                    /bpk-component-popover/,
                    /bpk-component-select/,
                    /bpk-component-text/,
                    /bpk-react-utils/,
                    /bpk-scrim-utils/,
                    /src/,
                ],
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: [
                        ['@babel/plugin-syntax-dynamic-import'],
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: false }],
                        ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }],
                        ['@babel/plugin-transform-flow-strip-types'],
                        ['@babel/plugin-transform-runtime'],
                    ],
                },
            },
            {
                test: /\.css$/,
                include: [
                    /bpk-component-breakpoint/,
                    /bpk-component-calendar/,
                    /bpk-component-close-button/,
                    /bpk-component-datepicker/,
                    /bpk-component-icon/,
                    /bpk-component-input/,
                    /bpk-component-link/,
                    /bpk-component-modal/,
                    /bpk-component-navigation-bar/,
                    /bpk-component-popover/,
                    /bpk-component-select/,
                    /bpk-component-text/,
                    /bpk-react-utils/,
                    /bpk-scrim-utils/,
                ],
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[a|c]ss$/,
                include: [
                    /bpk-component-breakpoint/,
                    /bpk-component-calendar/,
                    /bpk-component-close-button/,
                    /bpk-component-datepicker/,
                    /bpk-component-icon/,
                    /bpk-component-input/,
                    /bpk-component-link/,
                    /bpk-component-modal/,
                    /bpk-component-navigation-bar/,
                    /bpk-component-popover/,
                    /bpk-component-select/,
                    /bpk-component-text/,
                    /bpk-react-utils/,
                    /bpk-scrim-utils/,
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(jpg|jpeg|png|svg)?$/,
                include: [/bpk-component-calendar/, /bpk-component-icon/, /bpk-component-select/, /bpk-react-utils/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                            name: '[name].[ext]',
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new MiniCssExtractPlugin()],
};
