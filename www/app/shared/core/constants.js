(function () {
    "use strict";

    var globals = {};

    /**
     * Local Storage
     */
    globals.LOCALSTORAGE = {
        "CARD_COLLECTION": "WEX_Card_Collection",
        "ACTIVATED_CARDS_COLLECTION": "Activated_Cards_Collection"
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
        },
        CLIENT_CREDENTIALS: {
            CLIENT_ID: "mobileCardActivator",
            CLIENT_SECRET: "E%bRr^TPBwwmmerIW?|0o0J*X%q_q6HTth7zZQ5j"
        }
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
     * Driver API
     */
    globals.DRIVER_API = {
        BASE_URL: "@@@STRING_REPLACE_APP_URL_DRIVER_API@@@",
        DRIVERS: {
            "BASE": "drivers"
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

    /**
     * Card Constants
     */
    globals.CARD = {
        STATUS: {
            "ACTIVE": "ACTIVE",
            "SUSPENDED": "SUSPENDED",
            "TERMINATED": "TERMINATED"
        }
    };

    /**
     * Account Constants
     */
    globals.ACCOUNT = {
        STATUS: {
            "ACTIVE": "ACTIVE",
            "SUSPENDED": "SUSPENDED",
            "TERMINATED": "TERMINATED"
        }
    };

    /**
     * Card Manager
     */
    globals.CARD_MANAGER = {
        ACTIVATED_TIME_TO_LIVE: 600 // this value is in seconds
    };

    /**
     * Add Card page
     */
    globals.ADD_CARD = {
        "CONFIG": {
            "title": "Add Card",
            "instructionalText": "Please enter your card information below.",
            "embossedAccountNumber": {
                "label": "Account Number",
                "errors": {
                    "required": "Account Number is required.",
                    "length": "Account Number must be 13 numbers."
                }
            },
            "embossedCardNumber": {
                "label": "Card Suffix Number",
                "errors": {
                    "required": "Card Suffix Number is required.",
                    "length": "Card Suffix Number must be 5 numbers."
                }
            },
            "cancelButton": "Cancel",
            "submitButton": "Add Card",
            "serverErrors": {
                "CARD_INVALID": "The card cannot be added.",
                "CARD_NOT_FOUND": "The card cannot be found. Please check that the values entered are correct."
            }
        }
    };

    /**
     * Card List page
     */
    globals.CARD_LIST = {
        "VIEW_MODE": {
            "CONFIG": {
                "title": "My Cards",
                "instructionalText": "Tap to activate or deactivate a card.",
                "embossedAccountNumber": {
                    "label": "Account No."
                },
                "embossedCardNumber": {
                    "label": "Card No."
                },
                "successMessage": "The card has been successfully added.",
                "serverErrors": {
                    "CARD_CANNOT_BE_ACTIVATED": "The card cannot be activated.",
                    "CARD_CANNOT_BE_SUSPENDED": "The card cannot be suspended.",
                    "CARD_CANNOT_BE_USED"     : "The card cannot be used."
                },
                "timer": {
                    "max": globals.CARD_MANAGER.ACTIVATED_TIME_TO_LIVE,
                    "color": "#007a00",
                    "interval": 1
                }
            }
        },
        "REMOVE_MODE": {
            "CONFIG": {
                "title": "My Cards",
                "instructionalTextPart1": "Tap the ",
                "instructionalTextPart2": " to remove a card.",
                "embossedAccountNumber": {
                    "label": "Account No."
                },
                "embossedCardNumber": {
                    "label": "Card No."
                },
                "cancelButton": "Cancel",
                "confirmation": {
                    "template": "Do you want to remove the card ending in {{CARD_SUFFIX_NUMBER}}?",
                    "cancelText": "No",
                    "okText": "Yes"
                },
                "successToastText": "The card has been successfully removed."
            }
        }
    };

    /**
     * Card Prompts page
     */
    globals.CARD_PROMPTS = {
        "CONFIG": {
            "title": "Activate Card",
            "vehicleId": {
                "label": "Vehicle ID",
                "errors": {
                    "required": "Vehicle ID is required.",
                    "length": "Vehicle ID must be 4 or 6 numbers."
                }
            },
            "odometer": {
                "label": "Odometer",
                "errors": {
                    "required": "Odometer is required.",
                    "number": "Odometer reading may only contain numbers."
                }
            },
            "submitButton": "Activate Card",
            "cancelButton": "Cancel"
        }
    };

    globals.DRIVER_LOGIN = {
        "CONFIG": {
            "title": "Card Activator",
            "links": {
                "register": "I need to register",
                "continue": "Continue to app"
            },
            "emailAddress": {
                "label": "Email Address",
                "errors": {
                    "required": "Email Address is required.",
                    "format": "Email Address must be a valid format."
                }
            },
            "passcode": {
                "label": "Passcode",
                "errors": {
                    "required": "Passcode is required."
                }
            },
            "submitButton": "Log in"
        }
    };

    globals.DRIVER_REGISTER = {
        "CONFIG": {
            "title": "Registration",
            "cancelButton": "Cancel",
            "instructionalText": "All fields are required.",
            "emailAddress": {
                "label": "Email Address",
                "errors": {
                    "required": "Email Address is required.",
                    "format": "Email Address must be a valid format."
                }
            },
            "embossedAccountNumber": {
                "label": "Account Number",
                "errors": {
                    "required": "Account Number is required.",
                    "length": "Account Number must be 13 numbers.",
                    "numeric": "Account Number must be numeric."
                },
                "tooltip": {
                    "title": "Account Number",
                    "body": "<img src=\"img/account_number.png\">",
                    "closeButton": "Close"
                }
            },
            "embossedCardNumber": {
                "label": "Card Number",
                "errors": {
                    "required": "Card Number is required.",
                    "length": "Card Number must be 5 numbers.",
                    "numeric": "Card Number must be numeric."
                },
                "tooltip": {
                    "title": "Card Number",
                    "body": "<img src=\"img/card_number.png\">",
                    "closeButton": "Close"
                }
            },
            "submitButton": "Register",
            "serverErrors": {
                "REGISTRATION_FAILED": "Registration could not be completed. Please check your entries and try again"
            }
        }
    };

    /**
     * App-level notifications
     */
    globals.NOTIFICATIONS = {
        "serverConnectionError": "Could not connect to server. Please try again later.",
        "networkError"         : "Lost internet connection."
    };

    angular
        .module("app.core")
        .constant("globals", globals);

})();