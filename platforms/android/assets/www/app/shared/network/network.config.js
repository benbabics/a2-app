(function () {
    "use strict";

    var httpConfig = function($httpProvider) {
        // Set defaults
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    };

    angular
        .module("app.shared.network")
        .config(httpConfig);
})();
