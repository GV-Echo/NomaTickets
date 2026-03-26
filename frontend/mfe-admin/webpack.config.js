const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {merge} = require('webpack-merge');
const {createBaseConfig, createRemoteFederationPlugin} = require('@nomatickets/shared-webpack-config');

module.exports = (env, argv) => {
    const baseConfig = createBaseConfig(env, argv);

    return merge(baseConfig, {
        entry: './src/index.tsx',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            publicPath: 'auto',
            clean: true,
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                '@shared': path.resolve(__dirname, '../../shared'),
            },
        },

        plugins: [
            createRemoteFederationPlugin({
                name: 'adminApp',
                filename: 'remoteEntry.js',
                exposes: {
                    './AdminApp': './src/AdminApp',
                },
                remotes: {
                    host: `host@${process.env.HOST_URL || 'http://localhost:3000'}/remoteEntry.js`,
                },
            }),

            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
            }),
        ],

        devServer: {
            port: 3012,
            historyApiFallback: true,
            hot: true,
            headers: {'Access-Control-Allow-Origin': '*'},
            proxy: [
                {context: ['/auth'], target: 'http://localhost:3001', changeOrigin: true},
                {context: ['/booking'], target: 'http://localhost:3002', changeOrigin: true},
            ],
        },
    });
};
