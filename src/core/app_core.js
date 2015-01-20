(function () {
    'use strict';

    var path = require('path'),
        hapi = require('hapi'),
        hoek = require('hoek'),
        socketIO = require('socket.io'),
        logger = require('./logger'),
        async = require('async'),
        manifest = require(path.join(__dirname, '../settings'));

    var app = new hapi.Server(manifest.server.options);

    var runConnections = function (callback) {
        async.mapSeries(manifest.server.connections, function (connection, fn) {
            app.connection(connection.configuration);
            return fn(null, app.select(connection.configuration.labels));
        }, callback);
    };

    var runServer = function (callback) {
        app.start(function (error) {
            if (error) {
                return callback(error);
            }
            return callback(null, app);
        });
    };

    var runSockets = function (callback) {
        async.mapSeries(app.connections, function (connection, fn) {
            var io = socketIO.listen(connection.listener);
            io.sockets.on('connection', function (socket) {
                socket.emit({msg: 'socket connected.'});
                logger.info('socket started at:', socket);
            });
            return fn(null, io);
        }, callback);
    };

    var registerMethods = function (callback) {
        var methods = filesLoader(manifest.server.methods.dirs);

        if (methods) {
            async.mapSeries(methods, function (file, fn) {
                var func = require(file);
                Object.keys(func).forEach(function (name) {
                    app.method(name, func[name]);
                });
                return fn(null, func);
            }, callback);
        }
        else {
            return callback(null, false);
        }
    };

    var registerPlugins = function (callback) {
        var plugins = filesLoader(manifest.server.plugins.dirs);

        if (plugins) {
            async.mapSeries(plugins, function (file, fn) {
                var plugin = require(file);
                app.register({
                    register: require(plugin.register),
                    options: plugin.options
                }, fn);
            }, callback);
        }
        else {
            return callback(null, false);
        }
    };

    var registerRoutes = function (callback) {
        var files = filesLoader(manifest.server.routes.dirs);

        if (files) {
            async.mapSeries(files, function (file, fn) {
                var routes = require(file);
                Object.keys(routes).forEach(function (route) {
                    app.route(routes[route]);
                });
                return fn(null, routes);
            }, callback);
        }
        else {
            return callback(null, false);
        }
    };

    var registerServices = function (callback) {
        async.mapSeries(Object.keys(manifest.services), function (key, cb) {
            var serviceFiles = filesLoader(manifest.services[key]);

            async.mapSeries(serviceFiles, function (serviceFile, fn) {
                var service = require(serviceFile);
                if (service.hasOwnProperty('register')) {
                    app.register({
                        register: require(service.register),
                        options: service.options
                    }, fn);
                }
                else {
                    return fn(null, false);
                }
            }, cb);
        }, callback);
    };

    var filesLoader = function (directories) {
        var files = [];

        directories.forEach(function (directory) {
            require('fs').readdirSync(directory).forEach(function (file) {
                files.push(path.join(directory, file));
            });
        });

        return files;
    };

    module.exports = function (callback) {
        async.auto({
            connections: runConnections,
            methods: ['connections', registerMethods],
            plugins: ['methods', registerPlugins],
            routes: ['plugins', registerRoutes],
            services: ['routes', registerServices],
            sockets: runSockets,
            hapiServer: runServer
        }, function (error, stack) {
            if (error) {
                logger.error('ApplicationCore#start', error);
            }

            stack.logger = logger;
            stack.manifest = manifest;

            return callback(null, stack);
        });
    };
})();
