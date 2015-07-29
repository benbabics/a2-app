(function () {
    "use strict";

    var sharedGlobals = {},
        globals = function () {
            return sharedGlobals;
        };

    sharedGlobals.LOGIN_STATE = "@@@STRING_REPLACE_LOGIN_STATE@@@";

    /**
     * General
     */
    sharedGlobals.GENERAL = {
        ERRORS: {
            "UNKNOWN_EXCEPTION": "ERROR: cause unknown."
        }
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
        CLIENT_CREDENTIALS: {
            CLIENT_ID    : "@@@STRING_REPLACE_AUTH_CLIENT_ID@@@",
            CLIENT_SECRET: "@@@STRING_REPLACE_AUTH_CLIENT_SECRET@@@"
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
        },
        BANKS: {
            "ACTIVE_BANKS": "payments/activeBanks"
        },
        INVOICES: {
            "CURRENT_INVOICE_SUMMARY": "payments/currentInvoiceSummary"
        },
        PAYMENTS: {
            "PAYMENT_ADD_AVAILABILITY": "payments/makePaymentAvailability"
        },
        USERS   : {
            "BASE"   : "users",
            "CURRENT": "current"
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