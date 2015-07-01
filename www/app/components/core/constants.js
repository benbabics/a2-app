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
            "submitButton": "Log In",
            "serverErrors": {
                "DEFAULT": "Invalid login information. Please check your username and password or go online to set up or recover your username and password."
            }
        }
    };

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .factory("globals", globals);

})();