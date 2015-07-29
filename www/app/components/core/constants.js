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
                "AUTHORIZATION_FAILED": "Your account is not able to be managed via the mobile application at this time.",
                "DEFAULT": "Invalid login information. Please check your username and password or go online to set up or recover your username and password.",
                "PASSWORD_EXPIRED": "Invalid login information. Go online to set up or recover your username and password.",
                "TOKEN_EXPIRED": "Your session has expired. Please login again.",
                "USER_LOCKED": "You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.",
                "USER_MUST_ACCEPT_TERMS": "Invalid login information. Go online to set up or recover your username and password.",
                "USER_MUST_SETUP_SECURITY_QUESTIONS": "Invalid login information. Go online to set up or recover your username and password.",
                "USER_NOT_ACTIVE": "Invalid login information. Go online to set up or recover your username and password."
            }
        }
    };

    appGlobals.LANDING = {
        "CONFIG": {
            "title": "WEX Fleet Manager",
            "availableCredit": "Available",
            "paymentDueDate": "Payment Due Date",
            "currentBalance": "Current Balance",
            "minimumPayment": "Minimum Payment",
            "makePayment": "Make Payment",
            "viewActivity": "View Activity",
            "cards": "Cards",
            "drivers": "Drivers"
        }
    };

    appGlobals.PAYMENT_ADD = {
        "CONFIG": {
            "title": "Make Payment",
            "invoiceNumber": "Invoice Number",
            "paymentDueDate": "Payment Due Date",
            "currentBalance": "Current Balance",
            "minimumPayment": "Minimum Payment",
            "amount": "Amount",
            "bankAccount": "From Account",
            "paymentDate": "Date",
            "submitButton": "Next"
        },
        "WARNINGS": {
            "BANK_ACCOUNTS_NOT_SETUP": "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
            "DIRECT_DEBIT_SETUP": "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
            "PAYMENT_ALREADY_SCHEDULED": "A payment has been scheduled already."
        }
    };

    appGlobals.NAV_BAR = {
        "CONFIG": {
            "menuButtonText": "Menu"
        }
    };

    appGlobals.MENU = {
        "CONFIG": {
            "options": {
                "home": "Home",
                "makePayment": "Make Payment",
                "viewActivity": "View Activity",
                "cards": "Cards",
                "drivers": "Drivers",
                "paymentHistory": "Payment History",
                "contactUs": "Contact Us",
                "logOut": "Log Out"
            }
        }
    };

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .factory("globals", globals);

})();