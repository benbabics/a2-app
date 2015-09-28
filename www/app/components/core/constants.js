(function () {
    "use strict";

    var appGlobals = {},
        globals = function (sharedGlobals) {
            return angular.extend({}, sharedGlobals, appGlobals);
        };

    appGlobals.DEFAULT_ROUTE = "/user/auth/login";

    appGlobals.LOCALSTORAGE = {
        "CONFIG": {
            "keyPrefix": "FLEET_MANAGER-"
        }
    };

    appGlobals.USER_LOGIN = {
        "CONFIG": {
            "title"       : "WEX Fleet Manager",
            "userName"    : {
                "label"    : "Username",
                "maxLength": 30
            },
            "password"    : {
                "label"    : "Password",
                "maxLength": 30
            },
            "submitButton": "Log In",
            "serverErrors": {
                "AUTHORIZATION_FAILED"              : "Your account is not able to be managed via the mobile application at this time.",
                "DEFAULT"                           : "Invalid login information. Please check your username and password or go online to set up or recover your username and password.",
                "PASSWORD_EXPIRED"                  : "Invalid login information. Go online to set up or recover your username and password.",
                "TOKEN_EXPIRED"                     : "Your session has expired. Please login again.",
                "USER_LOCKED"                       : "You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.",
                "USER_MUST_ACCEPT_TERMS"            : "Invalid login information. Go online to set up or recover your username and password.",
                "USER_MUST_SETUP_SECURITY_QUESTIONS": "Invalid login information. Go online to set up or recover your username and password.",
                "USER_NOT_ACTIVE"                   : "Invalid login information. Go online to set up or recover your username and password."
            }
        }
    };

    appGlobals.LANDING = {
        "CONFIG": {
            "title"              : "WEX Fleet Manager",
            "availableCredit"    : "Available",
            "billedAmount"       : "Billed",
            "unbilledAmount"     : "Unbilled",
            "paymentDueDate"     : "Payment Due Date",
            "currentBalance"     : "Current Balance",
            "minimumPayment"     : "Minimum Payment",
            "makePayment"        : "Make Payment",
            "transactionActivity": "Transaction Activity",
            "cards"              : "Cards",
            "scheduledPayments"  : "Scheduled"
        },
        "CHART": {
            "options": {
                animation         : false,
                percentageInnerCutout: 40,
                showTooltips      : false,
                segmentStrokeWidth: 1,
                scaleOverride     : true,
                responsive        : false
            },
            "colors" : {
                availableCreditPositive: "#39802b",
                availableCreditNegative: "#b30308",
                billedAmount  : "#334c5b",
                unbilledAmount: "#3799b3"
            }
        }
    };

    appGlobals.CARD_DETAIL = {
        "CONFIG": {
            "title"             : "Card Details",
            "cardNumber"        : "Card Number",
            "standardEmbossing" : "Standard Embossing",
            "optionalEmbossing" : "Optional Embossing",
            "status"            : "Status",
            "changeStatusButton": "Change Status",
            "reissueCardButton" : "Reissue Card"
        }
    };

    appGlobals.CARD_LIST = {
        "CONFIG"        : {
            "title"            : "Cards",
            "searchPlaceholder": "Search Card No & Embossing",
            "cardNumber"       : "Card No",
            "embossing"        : "Embossing",
            "status"           : "Status",
            "reloadDistance"   : "5%",
            "emptyList"        : "No Records Found."
        },
        "SEARCH_OPTIONS": {
            "PAGE_SIZE": 25,
            "STATUSES" : "active,suspended,terminated"
        }
    };

    appGlobals.CARD_CHANGE_STATUS = {
        "CONFIG": {
            "statuses": {
                "activate" : "Activate Card",
                "terminate": "Terminate Card"
            },
            "title"            : "Change Status",
            "card"             : "Card",
            "confirmationPopup": {
                "contentMessages": {
                    "active"    : "Are you sure you want to activate this card?",
                    "terminated": "Are you sure you want to terminate this card?"
                },
                "yesButton"      : "Yes",
                "noButton"       : "No"
            }
        }
    };

    appGlobals.CARD_CHANGE_STATUS_CONFIRMATION = {
        "CONFIG": {
            "title"               : "Change Status Confirmation",
            "confirmationMessages": {
                "active"    : "Card has been activated.",
                "terminated": "Card has been terminated."
            },
            "cardNumber"          : "Card Number",
            "standardEmbossing"   : "Standard Embossing",
            "optionalEmbossing"   : "Optional Embossing",
            "status"              : "Status",
            "cards"               : "Cards"
        }
    };

    appGlobals.CONTACT_US = {
        "CONFIG": {
            "title": "Contact Us"
        }
    };

    appGlobals.PAYMENT_ADD = {
        "WARNINGS": {
            "BANK_ACCOUNTS_NOT_SETUP"  : "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
            "DIRECT_DEBIT_SETUP"       : "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
            "NO_BALANCE_DUE"           : "Current Balance needs to be greater than $0.00.",
            "PAYMENT_ALREADY_SCHEDULED": "A payment has been scheduled already."
        }
    };

    appGlobals.PAYMENT_MAINTENANCE = {
        STATES: {
            "ADD": "ADD",
            "UPDATE": "UPDATE"
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_FORM = {
        "CONFIG": {
            "invoiceNumber"           : "Invoice Number",
            "paymentDueDate"          : "Due Date",
            "currentBalance"          : "Current Balance",
            "minimumPayment"          : "Statement Balance",
            "enterAmount"             : "Enter Amount",
            "amount"                  : "Amount",
            "bankAccount"             : "Bank Account",
            "scheduledDate"           : "Date",
            "scheduledDatePickerTitle": "Select Date",
            "submitButton"            : "Next"
        },
        "INPUTS": {
            "AMOUNT"      : {
                "CONFIG": {
                    "title": "Enter Amount"
                },
                "ERRORS": {
                    "zeroPayment"    : "The amount entered cannot be \"0.00\".",
                    "paymentTooLarge": "The amount entered cannot be greater than the Current Balance."
                }
            },
            "DATE"        : {
                "CONFIG": {
                    "maxFutureDays": 180
                }
            },
            "BANK_ACCOUNT": {
                "CONFIG": {
                    "title"            : "Select Bank Account",
                    "instructionalText": "Please Note: Managing bank accounts can only be completed on the web from the desktop application version."
                }
            }
        },
        "ADD"   : {
            "CONFIG": {
                "title": "Make Payment"
            }
        },
        "UPDATE"  : {
            "CONFIG": {
                "title": "Edit Payment"
            }
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_SUMMARY = {
        "CONFIG"  : {
            "title"                : "Payment Summary",
            "afternoonWarning"     : "Payments received after 3:30 pm Eastern Time may not be posted to your account until the next business day.",
            "weekendHolidayWarning": "Scheduled payments will be processed on the date selected. Payments scheduled for weekends/holidays will be posted the next business day.",
            "amount"               : "Amount",
            "bankAccount"          : "Bank Account",
            "scheduledDate"        : "Date",
            "cancelButton"         : "Cancel",
            "submitButton"         : "Schedule Payment"
        },
        "WARNINGS": {
            "PAYMENT_AMOUNT_LESS_THAN_MINIMUM": "This amount is less than the Statement Balance.",
            "PAYMENT_DATE_PAST_DUE_DATE"      : "The date selected for payment is past the Due Date."
        },
        "ADD"     : {
            "CONFIG": {}
        },
        "UPDATE"    : {
            "CONFIG": {}
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_CONFIRMATION = {
        "CONFIG": {
            "title"           : "Payment Confirmation",
            "confirmationText": "Your payment has been scheduled.",
            "amount"          : "Amount",
            "bankAccount"     : "Bank Account",
            "scheduledDate"   : "Date",
            "activityButton"  : "Payment Activity"
        },
        "ADD"   : {
            "CONFIG": {}
        },
        "UPDATE"  : {
            "CONFIG": {}
        }
    };

    appGlobals.PAYMENT_VIEW = {
        "CONFIG": {
            "title"               : "Payment Details",
            "amount"              : "Amount",
            "bankAccount"         : "Bank Account",
            "postedDate"          : "Date Posted",
            "scheduledDate"       : "Date Scheduled",
            "inProcess"           : "In Process",
            "method"              : "Method",
            "editButton"          : "Edit Payment",
            "cancelButton"        : "Cancel Payment",
            "cancelPaymentConfirm": {
                "content"  : "Are you sure you want to cancel this scheduled payment?",
                "yesButton": "Yes",
                "noButton" : "No"
            }
        }
    };

    appGlobals.PAYMENT_LIST = {
        "CONFIG"        : {
            "title"                     : "Payment Activity",
            "scheduledPaymentsHeading"  : "Scheduled Payments",
            "noScheduledPaymentsMessage": "There are currently no payments scheduled.",
            "completedPaymentsHeading"  : "Completed Payments",
            "noCompletedPaymentsMessage": "There are currently no payments completed."
        },
        "SEARCH_OPTIONS": {
            "PAGE_NUMBER": 0,
            "PAGE_SIZE"  : 50
        }
    };

    appGlobals.TERMS_OF_USE = {
        "CONFIG": {
            "title": "Terms of Use"
        }
    };

    appGlobals.TRANSACTION_LIST = {
        "CONFIG"        : {
            "title"          : "Transaction Activity",
            "reloadDistance" : "5%",
            "emptyList"      : "No Records Found."
        },
        "SEARCH_OPTIONS": {
            "MAX_DAYS" : 60,
            "PAGE_SIZE": 25
        }
    };

    appGlobals.POSTED_TRANSACTION_DETAIL = {
        "CONFIG": {
            "cardNumber"          : "Card Number",
            "customVehicleAssetId": "Asset ID",
            "driverFirstName"     : "Driver First Name",
            "driverLastName"      : "Driver Last Name",
            "grossCost"           : "Gross Cost",
            "merchantName"        : "Merchant Name",
            "merchantCityState"   : "Merchant City, ST",
            "netCost"             : "Net Cost",
            "postedDate"          : "Post Date",
            "productDescription"  : "Product Description",
            "title"               : "Transaction Details",
            "transactionDate"     : "Trans Date/Time",
            "transactionId"       : "Trans ID"
        }
    };

    appGlobals.NAV_BAR = {
        "CONFIG": {
        }
    };

    appGlobals.MENU = {
        "CONFIG": {
            "options": {
                "home"               : "Home",
                "addPayment"         : "Make Payment",
                "payments"           : "Payment Activity",
                "transactionActivity": "Transaction Activity",
                "cards"              : "Cards",
                "contactUs"          : "Contact Us",
                "terms"              : "Terms of Use",
                "logOut"             : "Log Out"
            }
        }
    };

    appGlobals.BUTTONS = {
        "CONFIG": {
            "cancel": "Cancel",
            "done"  : "Done"
        }
    };

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .factory("globals", globals);

})();