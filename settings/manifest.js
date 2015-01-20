(function () {
    'use strict';

    var path        = require('path'),
        basePath    = path.join(__dirname, '..'),
        nodeEnv     = process.env.NODE_ENV || 'development';

    var envFile     = require('habitat').load(path.join(__dirname, '..', nodeEnv + '.env'))

    module.exports = {
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
        sources: {
            databases: {
                primary: {
                    host: '127.0.0.1',
                    port: 3306,
                    driver: 'mysql'
                },
                secondary: {
                    host: '127.0.0.1',
                    port: 27017,
                    driver: 'mongodb'
                }
            },
            queues: {},
            mailers: {}
        }
    };
})();