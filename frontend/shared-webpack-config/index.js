const {createBaseConfig} = require('./base.config');
const {createHostFederationPlugin, createRemoteFederationPlugin, SHARED_DEPS} = require('./federation');

module.exports = {
    createBaseConfig,
    createHostFederationPlugin,
    createRemoteFederationPlugin,
    SHARED_DEPS,
};
