(function () {

    'use strict';

    var node_env = process.env.NODE_ENV || 'development';
    process.env.NODE_ENV = node_env;

    var habitat             = require('habitat'),
        path                = require('path'),
        environment_file    = habitat.load(path.join(__dirname, '../..', node_env + '.env')),
        settings_path       = path.join(__dirname, '../../settings');

    var getServersSettings = function () {
        var servers = habitat.load(path.join(settings_path, 'servers.json'));
        return servers.get('opt');
    };

    module.exports = {
        servers: getServersSettings()
    };
})();
