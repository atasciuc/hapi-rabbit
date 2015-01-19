(function () {
    'use strict';

    var path = require('path'),
        hapi = require('hapi'),
        socketIO = require('socket.io'),
        logger = require('./logger'),
        async = require('async'),
        manifest = require(path.join(__dirname, '../../settings', 'manifest'));

    var app = new hapi.Server(manifest.server.options);

    var start = function (fn) {
        logger.info('initial configuration:', manifest);

        async.auto({
            connections: runConnections,
            methods: loadMethods,
            server: ['connections', runServers],
            sockets: ['server', runSockets]
        }, function (error, stack) {
            if (error) {
                logger.error('ApplicationCore#start', error);
                return fn(error);
            }

            stack.logger = logger;
            stack.manifest = manifest;

            return fn(null, stack);
        });
    };

// this runs the connections predifined
    var runConnections = function (callback) {
        async.mapSeries(manifest.server.connections, function (server, fn) {
            app.connection(server.configuration);
            return fn(null, app.select(server.configuration.labels));
        }, callback);
    };

    var runServers = function (callback) {
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

    var loadMethods = function (callback) {
        var files = filesLoader(manifest.server.methods.path);
        if (files) {
            async.mapSeries(files, function (file, fn) {
                app.method(file.fileName, require(file.filePath));
            }, callback);
        }
    };

    var filesLoader = function (path) {
        var files = [];
        require('fs').readdirSync(path).forEach(function (file) {
            files.push({
                filePath: file,
                fileName: file.split("/").pop().replace(/.*/, "")
            });
        });
    };

    module.exports.start = function (callback) {
        return start(callback);
    };
})();
