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
     * Google Analytics
     */
    sharedGlobals.GOOGLE_ANALYTICS = {
        TRACKING_ID: "@@@STRING_REPLACE_GOOGLE_ANALYTICS_TRACKING_ID@@@"
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
            SCOPE: "brand_assets"
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
        }
    };

    /**
     * Brand Constants
     */
    sharedGlobals.BRAND = {
        GENERIC: "GENERIC",
        WEX    : "WEX",

        ASSET_TYPES: {
            "FILE": "FILE"
        },
        ASSET_SUBTYPES: {
            "BRAND_LOGO": "BRAND_LOGO"
        }
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
     * App Database Configuration
     */
    sharedGlobals.DATASTORE = {
        "APP_CONTEXT"    : "acctMaint",
        "DATABASE" : {
            "NAME" : "brandAssetsCollection",
            "COLLECTION" : {
                "name"  : "brandAssets",
                "unique": "brandAssetId",
                "index" : "clientBrandId"
            }
        }
    };

    angular
        .module("app.shared.core")
        .constant("sharedGlobals", sharedGlobals)
        .factory("globals", globals);

})();
