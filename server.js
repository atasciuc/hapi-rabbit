(function () {
    var app_core = require('./src/core/app_core');

    app_core.start(function (error, app) {
        app.server.connections.forEach(function (conn) {
            app.logger.info('server running at:', conn.info.uri);
        });
    });
})();