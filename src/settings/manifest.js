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
            appCredits: 'by Cuemby',
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
            connections: [
                {
                    configuration: {
                        labels: 'api',
                        host: env.api_host || '0.0.0.0',
                        port: env.api_port || 1337
                    },
                    listener: true,
                    routes: [
                        path.join(basePath, 'src/routes/api')
                    ]
                },
                {
                    configuration: {
                        labels: 'dashboard',
                        host: env.dashboard_host || '0.0.0.0',
                        port: env.dashboard_port || 1338
                    },
                    listener: true,
                    routes: [
                        path.join(basePath, 'src/routes/dashboard')
                    ]
                },
                {
                    configuration: {
                        labels: 'web',
                        host: env.web_host || '0.0.0.0',
                        port: env.web_port || 1339
                    },
                    listener: false,
                    routes: [
                        path.join(basePath, 'src/routes/web')
                    ]
                }
            ],
            /**
             * Application methods
             */
            methods: [
                path.join(basePath, 'src/methods')
            ],
            /**
             * Application plugins
             */
            plugins: [
                path.join(basePath, 'src/plugins')
            ],
            /**
             * Application routes. Note: Available to all of the connections (servers)
             */
            routes: [
                path.join(basePath, 'src/routes'),
                path.join(basePath, 'src/routes/common')
            ]
        }
    };
})();