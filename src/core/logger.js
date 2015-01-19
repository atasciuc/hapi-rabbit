(function () {
    'use strict';

    var logger = require('bunyan');
    module.exports = logger.createLogger({
        name: 'HappyRabbit',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'error',
                stream: process.stdout,
                path: __dirname + '/log/error.log'
            }
        ]
    });
})();