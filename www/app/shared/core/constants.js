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
        ERRORS                 : {
            "UNKNOWN_EXCEPTION": "ERROR: cause unknown."
        },
        "cardNumberMask"       : "****",
        "defaultDateFormat"    : "MM/DD/YYYY",
        "defaultDateTimeFormat": "MM/DD/YYYY hh:mm:ss A"
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
            TOKENS: "uaa/oauth/token",
            GRANT_TYPE: {
                PASSWORD: "password",
                REFRESH: "refresh_token"
            },
            // Per the Spring OAuth2 spec it expects a list of scopes to be delimited by spaces
            SCOPE: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted"
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
        CARDS: {
            "UPDATE_TYPES"       : {
                "REISSUE": "reissue"
            },
            "BASE"               : "cards",
            "STATUS"             : "status",
            "CHECK_STATUS_CHANGE": "checkScheduledStatusChange"
        },
        ACCOUNTS: {
            "BASE": "accounts"
        },
        BANKS: {
            "ACTIVE_BANKS": "payments/activeBanks"
        },
        INVOICES: {
            "CURRENT_INVOICE_SUMMARY": "payments/currentInvoiceSummary"
        },
        PAYMENTS: {
            "BASE"                    : "payments",
            "PAYMENT_ADD_AVAILABILITY": "payments/makePaymentAvailability"
        },
        TRANSACTIONS: {
            "POSTED": {
                "BASE": "postedTransactions"
            }
        },
        USERS   : {
            "BASE"   : "users",
            "CURRENT": "current"
        }
    };

    /**
     * Configuration API
     */
    sharedGlobals.CONFIGURATION_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_CONFIGURATION_API@@@",
        BRANDS  : {
            "BASE"  : "brands",
            "ASSETS": "assets"
        },
        VERSIONS   : {
            "BASE"         : "versions",
            "STATUS"       : "status",
            "STATUS_VALUES": {
                "NO_UPDATE"  : "ok",
                "CAN_UPDATE" : "warn",
                "MUST_UPDATE": "fail"
            }
        }
    };

    /**
     * Brand Constants
     */
    sharedGlobals.BRAND = {
        GENERIC: "GENERIC",
        WEX    : "WEX",

        ASSET_TYPES: {
            "FILE": "FILE",
            "TEXT": "TEXT"
        },
        ASSET_SUBTYPES: {
            "BRAND_LOGO"                  : "BRAND_LOGO",
            "GOOGLE_ANALYTICS_TRACKING_ID": "GOOGLE_ANALYTICS_TRACKING_ID"
        }
    };

    /**
     * Online Enrollment API
     */
    sharedGlobals.ONLINE_ENROLLMENT_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_ONLINE_ENROLLMENT_API@@@"
    };

    /**
     * Payment Constants
     */
    sharedGlobals.PAYMENT = {
        STATUS: {
            "CANCELLED": "CANCELLED",
            "COMPLETE" : "COMPLETE",
            "SCHEDULED": "SCHEDULED",
            "PENDING"  : "PENDING",
            "UNKNOWN"  : "UNKNOWN"
        },
        METHOD: {
            DIRECT_DEBIT: "DIRECT_DEBIT",
            ONLINE      : "ONLINE",
            CHECK       : "CHECK",
            IVR         : "IVR",
            UNKNOWN     : "UNKNOWN",

            DISPLAY_MAPPINGS: {
                DIRECT_DEBIT: "Direct Debit",
                ONLINE      : "Online Payment",
                CHECK       : "Check",
                IVR         : "Phone Payment",
                UNKNOWN     : "Unknown"
            },

            BANK_ACCOUNT_NAME_DISPLAY_OVERRIDE: {
                DIRECT_DEBIT: "N/A",
                CHECK       : "N/A",
                UNKNOWN     : "N/A"
            }
        }
    };

    /**
     * Card Constants
     */
    sharedGlobals.CARD = {
        STATUS: {
            ACTIVE    : "active",
            SUSPENDED : "suspended",
            TERMINATED: "terminated"
        },
        REISSUE_REASON  : {
            DAMAGED: "damaged",
            LOST   : "lost",
            STOLEN : "stolen"
        },
        DISPLAY_MAPPINGS: {
            STATUS        : {
                ACTIVE    : "Active",
                SUSPENDED : "Suspended",
                TERMINATED: "Terminated",
                UNKNOWN   : "Unknown"
            },
            REISSUE_REASON: {
                DAMAGED: "Damaged",
                LOST   : "Lost",
                STOLEN : "Stolen",
                UNKNOWN: "Unknown"
            }
        }
    };

    /**
     * App-level notifications
     */
    sharedGlobals.NOTIFICATIONS = {
        "serverConnectionError": "Could not connect to server. Please try again later.",
        "networkError"         : "Lost internet connection."
    };

    sharedGlobals.USER = {
        ONLINE_APPLICATION: {
            WOL_NP : "WOL_NP",
            CLASSIC: "CLASSIC"
        }
    };

    /**
     * App Datastore Configuration
     */
    sharedGlobals.DATASTORE = {
        "NAME" : "@@@STRING_REPLACE_APP_DATASTORE_NAME@@@"
    };

    /**
     * Pull to refresh Configuration
     */
    sharedGlobals.PULL_TO_REFRESH = {
        "pullingText": "Pull to refresh",
        "spinner"    : "none",
        "showSpinner": false
    };

    /**
     * Date picker Configuration
     */
    sharedGlobals.DATE_PICKER = {
        mondayFirst    : false,
        setLabel       : "Select",
        showTodayButton: false
    };

    angular
        .module("app.shared.core")
        .constant("sharedGlobals", sharedGlobals)
        .factory("globals", globals);

})();
