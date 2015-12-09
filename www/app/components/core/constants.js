(function () {
    "use strict";

    /* jshint -W101 */
    // jscs:disable maximumLineLength

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
            "title"       : "Fleet SmartHub",
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
            "title"              : "Fleet SmartHub",
            "availableCredit"    : "Available",
            "billedAmount"       : "Billed",
            "unbilledAmount"     : "Unbilled",
            "paymentDueDate"     : "Due Date",
            "currentBalance"     : "Current Balance",
            "statementBalance"   : "Statement Balance",
            "makePayment"        : "Make Payment",
            "transactionActivity": "Transaction Activity",
            "cards"              : "Cards",
            "scheduledPayments"  : "Scheduled"
        },
        "CHART" : {
            "options": {
                animation            : false,
                percentageInnerCutout: 40,
                showTooltips         : false,
                segmentStrokeWidth   : 1,
                scaleOverride        : true,
                responsive           : false
            },
            "colors" : {
                availableCreditPositive: "#39802b",
                availableCreditNegative: "#b30308",
                billedAmount           : "#334c5b",
                unbilledAmount         : "#3799b3"
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
            "statuses"         : {
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
            "title"               : "Confirmation",
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

    appGlobals.CARD_REISSUE = {
        "CONFIG": {
            "title"              : "Reissue Card",
            "shippingAddress"    : "Shipping Address",
            "shippingMethod"     : "Shipping Method",
            "reissueReason"      : "Reason",
            "selectReissueReason": "Select Reason",
            "submitButton"       : "Reissue Card",
            "instructionalText"  : "Orders received after 3:00 pm Eastern Time may be processed the next business day.",
            "poBoxText"          : "Please Note: You have a P.O. Box address listed. Your card will be delivered via regular mail.",
            "confirmationPopup"  : {
                "content"  : "Are you sure you want to reissue this card?",
                "yesButton": "Yes",
                "noButton" : "No"
            }
        }
    };

    appGlobals.CARD_REISSUE_CONFIRMATION = {
        "CONFIG": {
            "title"              : "Confirmation",
            "confirmationMessage": "Your card has been reissued.",
            "cardNumber"         : "Card Number",
            "standardEmbossing"  : "Standard Embossing",
            "optionalEmbossing"  : "Optional Embossing",
            "status"             : "Status",
            "cards"              : "Cards"
        }
    };

    appGlobals.CARD_REISSUE_INPUTS = {
        "SHIPPING_METHOD": {
            "CONFIG": {
                "title": "Select Shipping Method"
            }
        },
        "REISSUE_REASON" : {
            "CONFIG": {
                "title": "Select Reason"
            }
        }
    };

    appGlobals.CONTACT_US = {
        "CONFIG": {
            "title"          : "Contact Us",
            "contentHeading" : "Do you have a question or comment?",
            "content"        : "Send us an email, including your name and the name of your business. A representative will respond as soon as possible.",
            "sendEmailButton": "Send Email",
            "sendEmailLink"  : "mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version 1.0"
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
            "ADD"   : "ADD",
            "UPDATE": "UPDATE"
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_FORM = {
        "CONFIG": {
            "invoiceNumber"            : "Invoice Number",
            "invoiceNumberNotAvailable": "N/A",
            "paymentDueDate"           : "Due Date",
            "currentBalance"           : "Current Balance",
            "statementBalance"         : "Statement Balance",
            "enterAmount"              : "Enter Amount",
            "amount"                   : "Amount",
            "bankAccount"              : "Bank Account",
            "scheduledDate"            : "Date",
            "scheduledDatePickerTitle" : "Select Date",
            "submitButton"             : "Next"
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
        "UPDATE": {
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
        "UPDATE"  : {
            "CONFIG": {}
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_CONFIRMATION = {
        "CONFIG": {
            "title"           : "Confirmation",
            "confirmationText": "Your payment has been scheduled.",
            "amount"          : "Amount",
            "bankAccount"     : "Bank Account",
            "scheduledDate"   : "Date",
            "activityButton"  : "Payment Activity"
        },
        "ADD"   : {
            "CONFIG": {}
        },
        "UPDATE": {
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
            "title"       : "Terms of Use",
            "introduction": "Here are the WEX Inc. (\"WEX\") Terms of Use (\"Terms of Use\") for the WEX&reg; Fleet SmartHub&trade; mobile application, including the software application that is compatible for use on (i) the iPhone&reg;, iPod&reg;, iPad&reg; mobile devices and other devices operating on the Apple mobile operating system (iOS), and/or (ii) a mobile device operating on the Android&trade; operating system (collectively, the \"App\"). These Terms of Use shall apply to any person (\"you\" or \"your\") who accesses or uses any feature of the App. Your use of the application constitutes your acceptance of the Terms of Use set forth below. WEX may change or supplement the Terms of Use as it deems appropriate and your continued or subsequent access to and use of the App constitutes your acceptance of such modified or supplemented Terms of Use. Any new update or revision of the App provided and/or made available by WEX shall be governed by the Terms of Use.",
            "sectionOne"  : "1. You are granted a non-exclusive, non-sublicensable, non-transferable, personal, limited license to install, access and use the App.",
            "sectionTwo"  : "2. You shall: (i) access and use the App for lawful purposes only; (ii) not sell, lease, rent, assign or otherwise allow any other third party to access or use the App; (iii) not modify, enhance, supplement, decompile, reverse engineer or create derivative works from the App; (iii) not access or use the App for the benefit of a third party; or (iv) not use the App in the development of any products or services to be provided to a third party. This limited right to access and use the App is revocable in the discretion of WEX and all rights, title and interest not expressly granted to you in these Terms of Use are reserved.",
            "sectionThree": "3. The App is displayed on a wireless web-enabled cell phone or other types of mobile devices (each a \"Mobile Device\"). You acknowledge and agree that WEX may collect, transmit, store, and use technical, location, login or other personal data and related information, including, but not limited to, technical information about your Mobile Device and information regarding your location, that is gathered periodically, to facilitate product support and other services in connection with the App.",
            "sectionFour" : "4. App data may be limited to (i) information that is readily available through current WEX systems; (ii) merchant locations where a WEX transaction has been authorized in the last six (6) months; and (iii) price information for transactions which have been authorized at that merchant location in the last 24 hours. WEX is not permitted to include all merchant brands in its price per gallon reporting tools and does not guarantee the accuracy of the price per gallon listed at each location. Price and participation may vary.",
            "sectionFive" : "5. Due to the wide variety of Mobile Device technology, WEX cannot guarantee that the App will work on all Mobile Devices. You may incur additional fees or charges from your data carrier for accessing the App. WEX PROVIDES THE APP \"AS IS\" AND MAKES NO EXPRESS WARRANTIES, WRITTEN OR ORAL, AND ALL OTHER WARRANTIES ARE SPECIFICALLY EXCLUDED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, RELIABILITY AND ANY WARRANTY ARISING BY STATUTE, OPERATION OF LAW, COURSE OF DEALING OR PERFORMANCE, OR USAGE OF TRADE.",
            "sectionSix"  : "6. Based on the capability of certain Mobile Devices, you may also be able to access tools and functions available to you through certain third-party licenses that have been granted to WEX. WEX MAKES NO REPRESENTATIONS OR WARRANTIES RELATED TO THE ACCURACY OR CURRENCY OF SUCH TOOLS, FUNCTIONS AND SERVICES PROVIDED THROUGH A THIRD-PARTY LICENSE.",
            "sectionSeven": "7. You accept all risk and responsibility for any losses, damages, and other consequences resulting directly or indirectly from using this App and any information or material available from it. WEX cannot guarantee the accuracy and availability of the App data. Neither WEX nor the developer shall be held liable for any errors and/or delays in the content and use of any App data.",
            "sectionEight": "8. You agree that you will not use the App or any services related thereto for any purposes prohibited by United States law and shall not use or otherwise export or re-export the App. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WEX, ITS AFFILIATES, AND THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS, WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM YOUR ACCESS AND/OR USE OF THE APP, INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, STATUTORY, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF WEX OR ANY WEX REPRESENTATIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
            "sectionNine" : "9. The Terms of Use set forth the entire understanding and agreement of the parties relating to the subject matter hereof, and supersede any prior or contemporaneous understandings of any kind or nature. The Terms of Use are governed by the internal laws of the State of Maine, without respect to conflict of laws principles. No instance of waiver by WEX of its rights or remedies under the Terms of Use shall imply any obligation to grant any similar, future or other waiver. The provisions of the Terms of Use are severable, and in the event any provision hereof is determined to be invalid or unenforceable, such invalidity or unenforceability shall not in any way affect the validity or enforceability of the remaining provisions hereof. No agency, partnership or joint venture relationship is intended or created between you and WEX as a result of your use of the App. The following provisions shall survive the expiration or termination of the Terms of Use: Sections 2, 5, 6, 7, 8 and 9.",
            "closing"     : "If you have any questions or concerns about WEX&reg; Fleet SmartHub&trade; mobile application or our Terms of Use, please email: <a href=\"mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version 1.0\">MobileApplications@wexinc.com</a>."
        }
    };

    appGlobals.TRANSACTION_LIST = {
        "CONFIG"        : {
            "title"         : "Transaction Activity",
            "reloadDistance": "5%",
            "emptyList"     : "No Records Found."
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
        "CONFIG": {}
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
