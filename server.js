(function () {
    var run = require('./src/core/app_core');

    run(function (error, application) {
        application.hapiServer.methods.displayConnectionsInfo(application);
        application.hapiServer.methods.sayHello(application.manifest.globals.appName);
    });
})();