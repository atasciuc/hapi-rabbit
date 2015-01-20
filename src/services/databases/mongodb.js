(function () {
    'use strict';

    var env = require('../../settings').env;

    module.exports = {
        register: 'hapi-mongodb',
        options: {
            url: env.mongodb_uri,
            settings: {
                db: {
                    native_parser: true
                }
            }
        }
    };
})();