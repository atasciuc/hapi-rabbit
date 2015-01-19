(function () {
    'use strict';

    var path        = require('path'),
        basePath    = path.join(__dirname, '..');

    var users = app.datasources('mysql').use('users')
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
                ] // here your can specify other methods that are not in the default path
            }
        },
        dataSources: {
            databases: {
                relational: {
                    host: '',
                    driver: '',
                    port: ''
                },
                secondary: {

                }
            },
            queues: []
        }
    };
})();