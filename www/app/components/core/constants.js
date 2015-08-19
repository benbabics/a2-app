(function () {
    "use strict";

    var appGlobals = {},
        globals = function (sharedGlobals) {
            return angular.extend({}, sharedGlobals, appGlobals);
        };

    appGlobals.DEFAULT_ROUTE = "/user/auth/login";

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
            "title"          : "WEX Fleet Manager",
            "availableCredit": "Available",
            "paymentDueDate" : "Payment Due Date",
            "currentBalance" : "Current Balance",
            "minimumPayment" : "Minimum Payment",
            "makePayment"    : "Make Payment",
            "viewActivity"   : "View Activity",
            "cards"          : "Cards",
            "drivers"        : "Drivers"
        }
    };

    appGlobals.PAYMENT_ADD = {
        "CONFIG"  : {
            "title"         : "Make Payment",
            "invoiceNumber" : "Invoice Number",
            "paymentDueDate": "Payment Due Date",
            "currentBalance": "Current Balance",
            "minimumPayment": "Minimum Payment",
            "enterAmount"   : "Enter Amount",
            "amount"        : "Amount",
            "bankAccount"   : "From Account",
            "scheduledDate" : "Date",
            "submitButton"  : "Next"
        },
        "WARNINGS": {
            "BANK_ACCOUNTS_NOT_SETUP"  : "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
            "DIRECT_DEBIT_SETUP"       : "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
            "NO_BALANCE_DUE"           : "Current Balance needs to be greater than $0.00.",
            "PAYMENT_ALREADY_SCHEDULED": "A payment has been scheduled already."
        },
        "INPUTS"  : {
            "AMOUNT"      : {
                "CONFIG": {
                    "title": "Amount"
                },
                "ERRORS": {
                    "zeroPayment"    : "The amount entered cannot be \"0.00\".",
                    "paymentTooLarge": "The amount entered cannot be greater than the Current Balance"
                }
            },
            "DATE"        : {
                "CONFIG": {
                    "title"        : "Date",
                    "maxFutureDays": 180
                }
            },
            "BANK_ACCOUNT": {
                "CONFIG": {
                    "title"            : "Account",
                    "instructionalText": "Please Note: Managing bank accounts can only be completed on the web from the desktop application version."
                }
            }
        }
    };

    appGlobals.PAYMENT_SUMMARY = {
        "CONFIG"  : {
            "title"                : "Payment Summary",
            "afternoonWarning"     : "Payments received after 3:30 pm Eastern Time may not be posted to your account until the next business day.",
            "weekendHolidayWarning": "Scheduled payments will be processed on the date selected. Payments scheduled for weekends/holidays will be posted the next business day.",
            "amount"               : "Amount",
            "bankAccount"          : "From Account",
            "scheduledDate"        : "Date",
            "cancelButton"         : "Cancel",
            "submitButton"         : "Schedule Payment"
        },
        "WARNINGS": {
            "PAYMENT_AMOUNT_LESS_THAN_MINIMUM": "This amount is less than the minimum payment.",
            "PAYMENT_DATE_PAST_DUE_DATE"      : "The date selected for payment is past the due date."
        }
    };

    appGlobals.PAYMENT_CONFIRMATION = {
        "CONFIG": {
            "title"           : "Payment Confirmation",
            "confirmationText": "Your payment has been scheduled.",
            "amount"          : "Amount",
            "bankAccount"     : "From Account",
            "scheduledDate"   : "Date",
            "activityButton"  : "Payment Activity"
        }
    };

    appGlobals.PAYMENT_VIEW = {
        "CONFIG": {
            "title"           : "Payment Details",
            "amount"          : "Amount",
            "bankAccount"     : "Account",
            "postedDate"      : "Date Posted",
            "scheduledDate"   : "Date Scheduled",
            "inProcess"       : "In Process",
            "method"          : "Method",
            "editButton"      : "Edit Payment",
            "cancelButton"    : "Cancel Payment"
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

    appGlobals.NAV_BAR = {
        "CONFIG": {
        }
    };

    appGlobals.MENU = {
        "CONFIG": {
            "options": {
                "home"        : "Home",
                "makePayment" : "Make Payment",
                "viewActivity": "View Activity",
                "cards"       : "Cards",
                "drivers"     : "Drivers",
                "payments"    : "Payment Activity",
                "contactUs"   : "Contact Us",
                "logOut"      : "Log Out"
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