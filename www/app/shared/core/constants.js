(function () {
    "use strict";

    var globals = {};

    /**
     * Local Storage
     */
    globals.LOCALSTORAGE = {
    };

    /**
     * Logging
     */
    globals.LOGGING = {
        "ENABLED": "@@@STRING_REPLACE_LOGGING_ENABLED@@@"
    };

    /**
     * Auth API
     */
    globals.AUTH_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_AUTH_API@@@",
        AUTH: {
            TOKENS: "uaa/oauth/token"
        }/*,
        CLIENT_CREDENTIALS: {
            CLIENT_ID: "mobileCardActivator",
            CLIENT_SECRET: "E%bRr^TPBwwmmerIW?|0o0J*X%q_q6HTth7zZQ5j"
        }*/
    };

    /**
     * Account Maintenance API
     */
    globals.ACCOUNT_MAINTENANCE_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_AM_API@@@",
        CARDS: {
            "BASE": "secure/cards",
            "STATUS": "status",
            "CHECK_STATUS_CHANGE": "checkScheduledStatusChange"
        },
        ACCOUNTS: {
            "BASE": "secure/accounts"
        }
    };

    /**
     * User Constants
     */
    globals.USER = {
        CREDENTIALS: {
            username: "@@@STRING_REPLACE_API_USERNAME@@@",
            password: "@@@STRING_REPLACE_API_PASSWORD@@@"
        }
    };

    angular
        .module("app.core")
        .constant("globals", globals);

})();