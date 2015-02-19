(function () {
    'use strict';

    var path = require('path'),
        hapi = require('hapi'),
        fs = require('fs'),
        socketIO = require('socket.io'),
        logger = require('./logger'),
        async = require('async'),
        manifest = require(path.join(__dirname, '../settings')),
        sockets = {},
        server = new hapi.Server(manifest.server.options);

    var runServer = function (callback) {
        server.start(function (error) {
            if (error) {
                return callback(error);
            }
            return callback(null, server);
        });
    };

    var loadFiles = function (directories, label) {
        var files = [],
            serverName = label;

        directories.forEach(function (directory) {
            if (fs.existsSync(directory)) {
                fs.readdirSync(directory).forEach(function (file) {
                    var filePath = path.join(directory, file);
                    if (!fs.statSync(filePath).isDirectory()) {
                        files.push({path: filePath, serverName: serverName});
                    }
                });
            }
        });
        return files;
    };

    var registerConnection = function (connection, callback) {
        server.connection(connection.configuration);
        var s = server.select(connection.configuration.labels);
        var connectionName = connection.configuration.labels;

        //@TODO Register methods, routes, plugins
        if (connection.routes) {
            async.mapSeries(loadFiles(connection.routes, connectionName), registerRoute, callback)
        }

        if (connection.listener) {
            sockets[connectionName] = socketIO.listen(s.listener);
            sockets[connectionName].sockets.on('connection', function (socket) {
                socket.emit({
                    msg: 'you are connected to ' + connectionName + ' server.'
                });
                logger.info('socket connection with: ' + connectionName, socket);
            });
        }

        return callback(null, s);
    };

    var registerMethod = function (file, callback) {
        var methods = require(file.path);
        Object.keys(methods).forEach(function (method) {
            try {
                server.method(method, methods[method]);
            } catch (e) {
                return callback(e);
            }
        });

        return callback(null, true);
    };

    var registerRoute = function (file, callback) {
        var routes = require(file.path);
        Object.keys(routes).forEach(function (route) {
            try {
                server.route(routes[route]);
            } catch (e) {
                return callback(e);
            }
        });

        return callback(null, true);
    };

    var registerPlugin = function (file, callback) {
        var plugin = require(file.path);
        try {
            server.register(plugin, callback);
        } catch (e) {
            return callback(e);
        }
    };

    var App = exports.App = {
        server: server,
        sockets: sockets,
        logger: logger,
        manifest: manifest
    };

    exports.run = function (callback) {
        async.auto({
            connections: function (callback) {
                if (!manifest.server.connections) {
                    throw new Error('You must add at least one connection.');
                }

                async.mapSeries(manifest.server.connections, registerConnection, callback);
            },
            methods: ['connections', function (callback) {
                if (!manifest.server.methods) {
                    return callback(null, false);
                }

                async.mapSeries(loadFiles(manifest.server.methods), registerMethod, callback);
            }],
            plugins: ['methods', function (callback) {
                if (!manifest.server.plugins) {
                    return callback(null, false);
                }

                async.mapSeries(loadFiles(manifest.server.plugins), registerPlugin, callback);
            }],
            routes: ['plugins', function (callback) {
                if (!manifest.server.routes) {
                    return callback(null, false);
                }

                return async.mapSeries(loadFiles(manifest.server.routes), registerRoute, callback);
            }],
            server: runServer
        }, function (error) {
            if (error) {
                logger.error('ApplicationCore', error);
            }

            App = {
                server: server,
                sockets: sockets,
                logger: logger,
                manifest: manifest
            };

            return callback(null, App);
        });
    };
})();
