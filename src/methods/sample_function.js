(function () {
    'use strict';

    module.exports = function (a, b, next) {
        return next(null, a + b);
    };
})();