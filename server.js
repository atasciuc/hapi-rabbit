(function () {
    var Core    = require('./src/core/app_core'),
        app     = Core.App;

    if (!module.parent) {
        console.log('running server.');
        Core.run(function (error) {
            if (error) {
                throw new Error(error);
            }
        });
    }

    app.server.methods.displayConnectionsInfo(app);
    app.server.methods.displayCreditsInfo(app);

    module.exports = app;
})();