const {ModuleFederationPlugin} = require('webpack').container;

const SHARED_DEPS = {
    react: {
        singleton: true,
        requiredVersion: '^18.2.0',
        eager: false,
    },
    'react-dom': {
        singleton: true,
        requiredVersion: '^18.2.0',
        eager: false,
    },
    'react-router-dom': {
        singleton: true,
        requiredVersion: '^6.20.0',
        eager: false,
    },
    mobx: {
        singleton: true,
        requiredVersion: '^6.10.0',
        eager: false,
    },
    'mobx-react-lite': {
        singleton: true,
        requiredVersion: '^3.4.0',
        eager: false,
    },
    axios: {
        singleton: true,
        requiredVersion: '^1.6.0',
        eager: false,
    },
};

const createHostFederationPlugin = ({name = 'host', remotes = {}, exposes = {}}) =>
    new ModuleFederationPlugin({
        name,
        remotes,
        exposes,
        shared: SHARED_DEPS,
    });

const createRemoteFederationPlugin = ({
                                          name,
                                          filename = 'remoteEntry.js',
                                          exposes = {},
                                          remotes = {},
                                      }) =>
    new ModuleFederationPlugin({
        name,
        filename,
        exposes,
        remotes,
        shared: SHARED_DEPS,
    });

module.exports = {createHostFederationPlugin, createRemoteFederationPlugin, SHARED_DEPS};
