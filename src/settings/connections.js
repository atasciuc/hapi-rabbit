(function () {
    'use strict';

    module.exports = [
        {
            configuration: {
                labels: 'primary',
                host: '127.0.0.1',
                port: 1337
            },
            listener: true
        },
        {
            configuration: {
                labels: 'secondary',
                host: '127.0.0.1',
                port: 1338
            },
            listener: true
        }
    ]
})();