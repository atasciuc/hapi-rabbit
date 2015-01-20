(function () {
    'use strict';

    exports.displayConnectionsInfo = function (application) {
        if (!application) {
            application.logger.info('Hey dude setup at least one connection.');
        }

        application.hapiServer.connections.forEach(function (conn) {
            application.logger.info('server running at:', conn.info.uri);
        });
    };

    exports.sayHello = function (name) {
        console.log('Hello', name);
    };
})();