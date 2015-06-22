(function () {
    "use strict";

    var httpConfig = function($httpProvider){
        // Set defaults
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    };

    var uiMaskConfig = function ($provide) {
        /*$provide.decorator("uiMaskConfig", ["$delegate", function($delegate) {
            $delegate.clearOnBlur = false;
            return $delegate;
        }]);*/
    };

    angular
        .module("app.core")
        .config(httpConfig)
        .config(uiMaskConfig);
})();