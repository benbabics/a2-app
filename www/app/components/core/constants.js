(function () {
    "use strict";

    var appGlobals = {},
        globals = function (sharedGlobals) {
            return angular.extend({}, sharedGlobals, appGlobals);
        };

    appGlobals.DEFAULT_ROUTE = "/user/auth/login";

    appGlobals.USER_LOGIN = {
        "CONFIG": {
            "title": "WEX Fleet Manager",
            "userName": {
                "label": "User Name",
                "maxLength": 30
            },
            "password": {
                "label": "Password",
                "maxLength": 30
            },
            "submitButton": "Log In"
        }
    };

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .factory("globals", globals);

})();