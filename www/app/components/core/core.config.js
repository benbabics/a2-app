(function () {
    "use strict";

    var urlConfig = function ($urlRouterProvider, appGlobals) {

        //set default route
        $urlRouterProvider.otherwise(appGlobals.DEFAULT_ROUTE);
    };

    angular
        .module("app.components.core")
        .config(urlConfig);
})();