const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const createBaseConfig = (_env, argv) => {
    const isDev = argv.mode !== 'production';

    return {
        mode: isDev ? 'development' : 'production',

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },

        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {targets: {browsers: ['last 2 versions']}}],
                                ['@babel/preset-react', {runtime: 'automatic'}],
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|ico|webp)$/,
                    type: 'asset/resource',
                    generator: {filename: 'assets/images/[name].[hash][ext]'},
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {filename: 'assets/fonts/[name].[hash][ext]'},
                },
            ],
        },

        plugins: [
            ...(isDev ? [] : [
                new MiniCssExtractPlugin({filename: 'assets/css/[name].[contenthash].css'}),
            ]),
        ],

        devtool: isDev ? 'eval-source-map' : 'source-map',

        optimization: {
            runtimeChunk: false,
        },
    };
};

module.exports = {createBaseConfig};
