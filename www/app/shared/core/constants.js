(function () {
    "use strict";

    var sharedGlobals = {},
        globals = function () {
            return sharedGlobals;
        };

    /**
     * Logging
     */
    sharedGlobals.LOGGING = {
        "ENABLED": "@@@STRING_REPLACE_LOGGING_ENABLED@@@"
    };

    /**
     * Auth API
     */
    sharedGlobals.AUTH_API = {
        BASE_URL          : "@@@STRING_REPLACE_APP_URL_AUTH_API@@@",
        AUTH              : {
            TOKENS: "uaa/oauth/token"
        },
        //TODO - Update
        CLIENT_CREDENTIALS: {
            CLIENT_ID    : "mobileCardActivator",
            CLIENT_SECRET: "E%bRr^TPBwwmmerIW?|0o0J*X%q_q6HTth7zZQ5j"
        }
    };

    /**
     * Account Maintenance API
     */
    sharedGlobals.ACCOUNT_MAINTENANCE_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_AM_API@@@",
        CARDS   : {
            "BASE"               : "secure/cards",
            "STATUS"             : "status",
            "CHECK_STATUS_CHANGE": "checkScheduledStatusChange"
        },
        ACCOUNTS: {
            "BASE": "secure/accounts"
        }
    };

    /**
     * User Constants
     */
    sharedGlobals.USER = {
        CREDENTIALS: {
            username: "@@@STRING_REPLACE_API_USERNAME@@@",
            password: "@@@STRING_REPLACE_API_PASSWORD@@@"
        }
    };

    /**
     * App-level notifications
     */
    sharedGlobals.NOTIFICATIONS = {
        "serverConnectionError": "Could not connect to server. Please try again later.",
        "networkError"         : "Lost internet connection."
    };

    angular
        .module("app.shared.core")
        .constant("sharedGlobals", sharedGlobals)
        .factory("globals", globals);

})();