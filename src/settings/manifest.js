(function () {
    'use strict';

    var path = require('path'),
        basePath = path.join(__dirname, '../..'),
        nodeEnv = process.env.NODE_ENV || 'development';

    var env = require('habitat').load(path.join(__dirname, '../..', nodeEnv + '.env'));

    module.exports = {
        env: env.get('HR'),
        globals: {
            appName: 'HappyRabbit',
            appRootPath: basePath
        },
        server: {
            options: {
                app: {},
                cache: require('catbox-memory'),
                connections: {},
                debug: {},
                files: {},
                load: {},
                mime: {},
                minimal: true,
                plugins: {}
            },
            connections: require('./connections'),
            methods: {
                dirs: [
                    path.join(basePath, 'src/methods')
                    //path.join(basePath, 'src/methods')
                ]
            },
            plugins: {
                dirs: [
                    path.join(basePath, 'src/plugins')
                ]
            },
            routes: {
                dirs: [
                    path.join(basePath, 'src/routes')
                ]
            }
        },
        services: {
            databases: [
                path.join(basePath, 'src/services/databases')
            ],
            queues: [
                path.join(basePath, 'src/services/queues')
            ],
            mailers: [
                path.join(basePath, 'src/services/mailers')
            ]
        }
    };
})();