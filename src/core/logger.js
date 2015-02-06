(function () {
    'use strict';

    var env     = require('../settings');
    var logger  = require('bunyan');

    module.exports = logger.createLogger({
        name: env.globals.appName || 'AppName',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'error',
                stream: process.stdout,
                path: __dirname + '/log/bunyan.log'
            }
        ]
    });
})();