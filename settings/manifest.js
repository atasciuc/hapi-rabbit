(function () {
    'use strict';

    var path        = require('path'),
        basePath    = path.join(__dirname, '..');

    module.exports = {
        globals: {
            appName: 'HappyRabbit',
            appRootPath: basePath
        },
        server: {
            options: {},
            connections: require('./connections'),
            methods: {
                path: path.join(basePath, 'src/methods'),
                auto: true,
                files: [
                    'src/data/my_function'
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