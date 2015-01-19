( function () {
    'use strict';

    var should    = require('chai').should();

    describe("ConfigManager", function () {
        var ConfigManager;

        beforeEach(function () {
            ConfigManager = require('../../src/config/config_manager');
        });

        it("should be \"development\" if not environment were provided.", function () {
            ConfigManager.environment.should.equal('development');
        });

        it("should be an function if environment where found.", function () {
            ConfigManager.environment_file.should.be.a('function');
        });
    });
})();