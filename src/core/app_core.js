(function () {
    'use strict';

    var path = require('path'),
        hapi = require('hapi'),
        socketIO = require('socket.io'),
        logger = require('./logger'),
        async = require('async'),
        manifest = require(path.join(__dirname, '../../settings', 'manifest'));

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

    var loadMethods = function (callback) {
        var files = filesLoader(manifest.server.methods.path);
        if (files) {
            async.mapSeries(files, function (file, fn) {
                var func = require(file.filePath);
                app.method(file.fileName, func);
                return fn(null, func);
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
        async.auto({
            connections: runConnections,
            //methods: ['connections', loadMethods],
            //sockets: ['server', runSockets]
            server: ['connections', runServer]
        }, function (error, stack) {
            if (error) {
                logger.error('ApplicationCore#start', error);
                return callback(error);
            }

            stack.logger = logger;
            stack.manifest = manifest;

            return callback(null, stack);
        });
    };
})();
