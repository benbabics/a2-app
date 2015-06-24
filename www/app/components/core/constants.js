(function () {
    "use strict";

    var appGlobals = {},
        globals = function (sharedGlobals) {
            return angular.extend({}, sharedGlobals, appGlobals);
        };

    appGlobals.DEFAULT_ROUTE = "/user/auth/login";

    appGlobals.USER_LOGIN = {
        "CONFIG": {
            "title": "WEX Fleet Manager"
        }
    };

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .factory("globals", globals);

})();