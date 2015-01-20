(function () {
    'use strict';

    exports.home = {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({
                status: 'connected',
                msg: 'Just hit our API, that\'s awesome!'
            })
                .code(200)
                .type('application/json');
        }
    };
})();