(function () {
    'use strict';

    exports.displayConnectionsInfo = function (app) {
        if (!app) {
            app.logger.info('Hey dude setup at least one connection.');
        }

        app.server.connections.forEach(function (conn) {
            app.logger.info('server running at:', conn.info.uri, conn.settings.labels);
        });
    };

    exports.displayCreditsInfo = function (app) {
        app.logger.info(app.manifest.globals.appCredits);
    };
})();