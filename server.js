(function () {
    var run = require('./src/core/app_core');

    run(function (error, app) {
        app.server.methods.displayConnectionsInfo(app);
        app.server.methods.sayHello(app.manifest.globals.appName);
    });
})();