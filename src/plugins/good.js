(function () {
    'use strict';

    module.exports = {
        register: 'good',
        dependencies: ['good-file', 'good-http'],
        options: {
            opsInterval: 1000,
            reporters: [{
                reporter: require('good-console'),
                args: [{log: '*', response: '*'}]
            }, {
                reporter: require('good-file'),
                args: [require('path').join(__dirname, '../../log/good.log'), {ops: '*', log: '*', error: '*'}]
            }, {
                reporter: require('good-http'),
                args: [{error: '*'}, 'http://prod.logs:3000', {
                    threshold: 20,
                    wreck: {
                        headers: {'x-api-key': 12345}
                    }
                }]
            }]
        }
    };
})();