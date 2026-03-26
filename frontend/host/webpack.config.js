const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {merge} = require('webpack-merge');
const {createBaseConfig, createHostFederationPlugin} = require('@nomatickets/shared-webpack-config');

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
                // Типы из корневого shared/ доступны как @shared/event и т.д.
                '@shared': path.resolve(__dirname, '../../shared'),
            },
        },

        plugins: [
            createHostFederationPlugin({
                name: 'host',
                remotes: {
                    eventsApp: `eventsApp@${process.env.EVENTS_URL || 'http://localhost:3011'}/remoteEntry.js`,
                    adminApp: `adminApp@${process.env.ADMIN_URL || 'http://localhost:3012'}/remoteEntry.js`,
                },
                // AuthContext доступен в MFE как import('host/AuthContext')
                exposes: {
                    './AuthContext': './src/providers/AuthProvider',
                },
            }),

            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
            }),
        ],

        devServer: {
            port: 3000,
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
