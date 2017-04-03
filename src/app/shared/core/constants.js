(function () {
    "use strict";

    var sharedGlobals = {},
        sharedGlobalsAndroid = {},
        sharedGlobalsIos = {},
        globals = function (_) {
            var platformGlobals = (function () {
                switch ("@@@STRING_REPLACE_PLATFORM@@@") {
                    case "android":
                        return sharedGlobalsAndroid;
                    case "ios":
                        return sharedGlobalsIos;
                    default:
                        return {};
                }
            })();

            return _.merge({}, sharedGlobals, platformGlobals);
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
     * Platform
     */
    sharedGlobals.PLATFORM = {
        "name": "Browser"
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
            SCOPE: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers drivers:status payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
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
        ALERTS: {
          "BASE": "alerts"
        },
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
        DRIVERS: {
            "BASE":   "drivers",
            "STATUS": "status"
        },
        INVOICES: {
            "CURRENT_INVOICE_SUMMARY": "payments/currentInvoiceSummary"
        },
        PAYMENTS: {
            "BASE"                    : "payments",
            "PAYMENT_ADD_AVAILABILITY": "payments/makePaymentAvailability"
        },
        TRANSACTIONS: {
            "PENDING": {
                "BASE": "pendingTransactions"
            },
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
        ACCEPT_TOUCH_ID: {
            "BASE": "accept-touch-id"
        },
        VERSIONS   : {
            "BASE"         : "versions",
            "STATUS"       : "status",
            "STATUS_VALUES": {
                "NO_UPDATE"  : "SUPPORTED",
                "CAN_UPDATE" : "DEPRECATED",
                "MUST_UPDATE": "UNSUPPORTED"
            }
        }
    };

    /**
     * Brand Constants
     */
    sharedGlobals.BRAND = {
        GENERIC: "GENERIC",
        WEX    : "WEX",

    };

    /**
     * Notifications API
     */
    sharedGlobals.NOTIFICATIONS_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_NOTIFICATIONS_API@@@",
        UNREAD: "unread",
        STATUS: {
            "READ": "READ",
            "UNREAD": "UNREAD"
        },
        REGISTER: "register"
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
     * Alert Constants
     */
    sharedGlobals.ALERT = {
      DISPLAY_MAPPINGS: {}
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
     * Driver Constants
     */
    sharedGlobals.DRIVER = {
        STATUS: {
            ACTIVE:     "active",
            SUSPENDED:  "suspended",
            TERMINATED: "terminated"
        },
        DISPLAY_MAPPINGS: {
            STATUS: {
                ACTIVE:     "Active",
                SUSPENDED:  "Suspended",
                TERMINATED: "Terminated",
                UNKNOWN:    "Unknown"
            }
        }
    };

    /**
     * App-level notifications
     */
    sharedGlobals.GLOBAL_NOTIFICATIONS = {
        "serverConnectionError": "Could not connect to server. Please try again later.",
        "networkError"         : "Lost internet connection."
    };

    sharedGlobals.USER = {
        ONLINE_APPLICATION: {
            WOL_NP     : "WOL_NP",
            CLASSIC    : "CLASSIC",
            DISTRIBUTOR: "DISTRIBUTOR"
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
        "pullingText": "Pull to refresh"
    };

    /**
     * Date picker Configuration
     */
    sharedGlobals.DATE_PICKER = {
        mondayFirst    : false,
        setLabel       : "Select",
        showTodayButton: false
    };

    sharedGlobals.FINGERPRINT_AUTH = {
        CONFIG: {
            defaultMessage: "Scan your fingerprint below to enter your account",
            platformName: "Fingerprint authentication"
        },
        PASSWORD_FALLBACK: {
            NONE   : "NONE", //Android only
            DEFAULT: "DEFAULT",
            CUSTOM : "CUSTOM" //iOS only
        }
    };

    /**
     * PLATFORM GLOBALS
     */

    /**
     * Android
     */
    sharedGlobalsAndroid.PLATFORM = {
        "name": "Android"
    };

    sharedGlobalsAndroid.FINGERPRINT_AUTH = {
        CONFIG: {
            platformName: "Fingerprint authentication"
        }
    };

    /**
     * iOS
     */
    sharedGlobalsIos.PLATFORM = {
        "name": "iOS"
    };

    sharedGlobalsIos.FINGERPRINT_AUTH = {
        CONFIG: {
            platformName: "Touch ID\u00AE"
        }
    };

    angular
        .module("app.shared.core")
        .constant("sharedGlobals", sharedGlobals)
        .constant("sharedGlobalsAndroid", sharedGlobalsAndroid)
        .constant("sharedGlobalsIos", sharedGlobalsIos)
        .factory("globals", globals);

})();
