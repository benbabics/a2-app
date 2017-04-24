(function () {
    "use strict";

    /* jshint -W101 */
    /*jshint multistr: true */
    // jscs:disable maximumLineLength

    var appGlobals = {},
        appGlobalsAndroid = {},
        appGlobalsIos = {},
        globals = function (_, sharedGlobals, sharedGlobalsAndroid, sharedGlobalsIos) {
            var platformGlobals = (function () {
                switch ("@@@STRING_REPLACE_PLATFORM@@@") {
                    case "android":
                        return  _.merge({}, sharedGlobalsAndroid, appGlobalsAndroid);
                    case "ios":
                        return _.merge({}, sharedGlobalsIos, appGlobalsIos);
                    default:
                        return {};
                }
            })();

            return _.merge({}, sharedGlobals, appGlobals, platformGlobals);
        };

    appGlobals.DEFAULT_ROUTE = "/user/auth/login";


    // Login state by nature is unsecure and does not need to be listed here
    appGlobals.UNSECURE_STATES = [
        "app.exit",
        "user.auth.check",
        "version.status"
    ];

    appGlobals.LOCALSTORAGE = {
        "CONFIG": {
            "keyPrefix": "FLEET_MANAGER-"
        },
        "KEYS": {
            "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE",
            "USERNAME"              : "USERNAME"
        }
    };


    appGlobals.USER_LOGIN = {
        "CONFIG": {
            "ANALYTICS"   : {
                "pageName"   : "Login",
                "events"     : {
                    "acceptTerms"             : ["SetUpBiometrics", "AcceptTerms"],
                    "declineTerms"            : ["SetUpBiometrics", "DeclineTerms"],
                    "successfulLoginManual"   : ["Login", "LoginSuccessfulManual"],
                    "successfulLoginBiometric": ["Login", "LoginSuccessfulBiometric"],
                    "inactiveStatus"        : ["Login", "InactiveStatus"],
                    "accountNotReadyStatus" : ["Login", "AccountNotReadyStatus"],
                    "wrongCredentialsStatus": ["Login", "WrongCredentialsStatus"],
                    "lockedPasswordStatus"  : ["Login", "LockedPasswordStatus"],
                    "passwordChangedStatus" : ["Login", "PasswordChangedStatus"],
                    "connectionErrorStatus" : ["Login", "ConnectionErrorStatus"]
                },
                "errorEvents": {
                    "USER_MUST_ACCEPT_TERMS"            : "inactiveStatus",
                    "USER_MUST_SETUP_SECURITY_QUESTIONS": "inactiveStatus",
                    "USER_NOT_ACTIVE"                   : "inactiveStatus",
                    "AUTHORIZATION_FAILED"              : "accountNotReadyStatus",
                    "DEFAULT"                           : "wrongCredentialsStatus",
                    "USER_LOCKED"                       : "lockedPasswordStatus",
                    "PASSWORD_CHANGED"                  : "passwordChangedStatus",
                    "CONNECTION_ERROR"                  : "connectionErrorStatus"
                }
            },
            "title"       : "Fleet SmartHub",
            "userName"    : {
                "label"    : "Username",
                "maxLength": 30
            },
            "password"    : {
                "label"    : "Password",
                "maxLength": 30
            },
            "rememberMe"  : {
                "label"    : "Remember<br/>Username"
            },
            "touchId": {
                "disabled": {
                    "labelAndroid": "Set Up<br/>Fingerprint",
                    "labelIos": "Set Up<br/>Touch ID"
                },
                "settingsPrompt": {
                    "title": "",
                    "messageAndroid": "Fingerprint authentication must be enabled on your device to use this feature.",
                    "messageIos": "Touch ID\u00AE must be enabled on your device to use this feature.",
                    "buttons": {
                        "cancel": "Cancel",
                        "settings": "Settings"
                    }
                },
                "warningPrompt": {
                    "title": "",
                    "messageAndroid": "Your fingerprint authentication will be disabled.",
                    "messageIos": "Your Touch ID\u00AE will be disabled.",
                    "buttons": {
                        "cancel": "Cancel",
                        "ok": "OK"
                    }
                }
            },
            "submitButton": "Log In",
            "serverErrors": {
                "AUTHORIZATION_FAILED"              : "We're sorry but you are not able to manage your account via the mobile application at this time. Please use Fleet Manager Online, our full feature site.",
                "DEFAULT"                           : "Invalid login information. Please check your username and password or go online to set up or recover your username and password.",
                "PASSWORD_CHANGED"                  : "Invalid login information. Please re-enter your username and password.",
                "PASSWORD_EXPIRED"                  : "Invalid login information. Go online to set up or recover your username and password.",
                "CONNECTION_ERROR"                  : "Login failed. Please try again later.",
                "TOKEN_EXPIRED"                     : "Your session has expired. Please login again.",
                "USER_LOCKED"                       : "You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.",
                "USER_MUST_ACCEPT_TERMS"            : "Invalid login information. Go online to set up or recover your username and password.",
                "USER_MUST_SETUP_SECURITY_QUESTIONS": "Invalid login information. Go online to set up or recover your username and password.",
                "USER_NOT_ACTIVE"                   : "Invalid login information. Go online to set up or recover your username and password."
            },
            "sessionTimeOut": "Your session has timed out due to 15 minutes of inactivity. Please login to access your account.",
            "enrollment": {
                "label": "Enroll Now"
            }
        }
    };

    appGlobals.LANDING = {
        "CONFIG": {
            "ANALYTICS"   : {
                "pageName": "Home",
                "events": {
                    "makePaymentLink"        : ["Payment", "MakePaymentLinkHome"],
                    "cardsLink"              : ["Cards", "CardsLinkHome"],
                    "driversLink"            : ["Drivers", "DriversLinkHome"],
                    "transactionActivityLink": ["Transaction", "TransactionActivityLinkHome"]
                }
            },
            "title"              : "Fleet SmartHub",
            "availableCredit"    : "Available",
            "billedAmount"       : "Billed",
            "unbilledAmount"     : "Unbilled",
            "paymentDueDate"     : "Due Date",
            "pendingAmount"      : "Pending",
            "currentBalance"     : "Current Balance",
            "statementBalance"   : "Statement Balance",
            "makePayment"        : "Make Payment",
            "transactions"       : "Transactions",
            "cards"              : "Cards",
            "drivers"            : "Drivers",
            "scheduledPayments"  : "Scheduled"
        },
        "CHART" : {
            "options"  : {
                animation            : true,
                percentageInnerCutout: 70,
                showTooltips         : false,
                segmentStrokeWidth   : 1,
                scaleOverride        : true,
                responsive           : false
            },
            "colors"   : {
                availableCredit        : "#3eb049",
                availableCreditNegative: "#ff0000",
                billedAmount           : "#324e5d",
                unbilledAmount         : "#34b39d",
                pendingAmount          : "#efcc57"
            },
            "constants": {
                "negativeCreditData": 1 //forces angular-chart.js to render negative/zero credit data as a solid/filled graph
            }
        },
        "BACK_TO_EXIT": {
            "duration": 3000, //ms
            "position": "bottom",
            "message" : "Press again to exit."
        }
    };

    appGlobals.CARD_DETAIL = {
        "CONFIG": {
            "ANALYTICS"                : {
                "pageName": "CardDetails"
            },
            "title"                    : "Card Details",
            "cardNumber"               : "Card Number",
            "standardEmbossing"        : "Standard Embossing",
            "optionalEmbossing"        : "Optional Embossing",
            "status"                   : "Status",
            "changeStatusButton"       : "Change Status",
            "reissueCardButton"        : "Reissue Card",
            "transactionActivityButton": "Transaction Activity"
        }
    };

    appGlobals.CARD_LIST = {
        "CONFIG": {
            "ANALYTICS": {
                "pageName": "Cards",
                "events": {
                    "searchSubmitted": [ "Cards", "SearchCardLink" ]
                }
            },
            "title":               "Cards",
            "searchPlaceholder":   "Search Card Number or Embossing",
            "cardNumber":          "Card Number",
            "embossing":           "Embossing",
            "status":              "Status",
            "listCardsActive":     "Active Cards",
            "listCardsSuspended":  "Suspended Cards",
            "listCardsTerminated": "Terminated Cards",
            "emptyList":           "No Records Found."
        },
        "SEARCH_OPTIONS": {
            "PAGE_SIZE": 25,
            "STATUSES":  "active,suspended,terminated",
            "STATUS_ACTIVE": "active"
        }
    };

    appGlobals.CARD_CHANGE_STATUS = {
        "CONFIG": {
            "ANALYTICS"        : {
                "pageName": "ChangeStatus"
            },
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
            "ANALYTICS"           : {
                "pageName": "ChangeStatusConfirmation"
            },
            "title"               : "Confirmation",
            "confirmationMessages": {
                "active"    : "Your card has been activated.",
                "terminated": "Your card has been terminated."
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
            "ANALYTICS"          : {
                "pageName": "ReissueCard"
            },
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
            "ANALYTICS"          : {
                "pageName": "ReissueCardConfirmation"
            },
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
                "ANALYTICS": {
                    "pageName": "SelectShippingMethod"
                },
                "title"    : "Select Shipping Method"
            }
        },
        "REISSUE_REASON" : {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "SelectReason"
                },
                "title"    : "Select Reason"
            }
        }
    };

    appGlobals.CONTACT_US = {
        "CONFIG": {
            "title"          : "Contact Us",
            "contentHeading" : "Do you have a question or comment?",
            "content"        : "Send us an email, including your name and the name of your business. A representative will respond as soon as possible.",
            "sendEmailButton": "Send Email",
            "sendEmailLink"  : "mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version "
        }
    };

    appGlobals.DRIVER_LIST = {
        "CONFIG": {
            "ANALYTICS": {
                "pageName": "Drivers",
                "events": {
                    "searchSubmitted": [ "Drivers", "SearchDriverLink" ]
                }
            },
            "title":                 "Drivers",
            "emptyList":             "No Records Found.",
            "listName":              "Name",
            "listDriverId":          "Driver ID",
            "listDriversActive":     "Active Drivers",
            "listDriversTerminated": "Terminated Drivers",
            "searchPlaceholder":     "Search Name or Driver ID"
        },
        "SEARCH_OPTIONS": {
            "PAGE_SIZE":     999, //Number.MAX_VALUE,
            "STATUSES":      "active,suspended,terminated",
            "STATUS_ACTIVE": "active"
        }
    };

    appGlobals.DRIVER_DETAILS = {
        "CONFIG": {
            "title":                     "Driver Details",
            "actionStatusTitle":         "Change Driver Status",
            "actionStatusCancel":        "Cancel",
            "bannerStatusChangeSuccess": "Status change successful.",
            "bannerStatusChangeFailure": "Status change failed. Please try again.",
            "detailDriverId":            "Driver ID",
            "detailEmail":               "Email Address",
            "detailMobile":              "Mobile Phone",
            "labelChangeStatus":         "Change Status",
            "labelTransactions":         "Transactions",
            "phoneAndEmailApplications": ["WOL_NP", "DISTRIBUTOR"],
            "statuses": [
                { "id": "ACTIVE", "label": "Active" },
                { "id": "TERMINATED", "label": "Terminated" }
            ]
        }
    };

    appGlobals.NOTIFICATIONS = {
        "CONFIG": {
            "ANALYTICS": {
                "pageName": "Notifications",
                "events": {
                    "rejectedBanner": ["Notifications", "RejectBanner"],
                    "rejectedPrompt": ["Notifications", "RejectPrompt"],
                    "hasEnabled":     ["Notifications", "Accepted"]
                }
            },
            "banner": {
                "content": "Improve your SmartHub experience.",
                "buttonLabels": {
                    "accept": "Enable Notifications"
                }
            },
            "prompt": {
                "title": "Stay Updated on Your Fleet",
                "content": "Allow Fleet SmartHub to send you alert notifications to keep you aware on any irregular account activity.",
                "buttonLabels": {
                    "accept": "I'm Interested",
                    "decline": "No Thanks"
                }
            }
        }
    };

    appGlobals.NOTIFICATIONS_LIST = {
        "CONFIG": {
            "ANALYTICS": {
                "pageName": "Alerts",
                "events": {
                    "scroll": ["Alerts", "InfiniteScroll"]
                }
            },
            "title":                   "Alerts",
            "emptyList":               "There are no alerts at this time.",
            "labelDeleteNotification": "Delete"
        },
        "SEARCH_OPTIONS": {
            "PAGE_SIZE": 25,
            "STATUS_ACTIVE": "active"
        },
        "REASON_PREFIX": {
            "TRANSACTION_DECLINE" : "Decline: "
        }
    };

    appGlobals.PAYMENT_MAINTENANCE = {
        STATES: {
            "ADD"   : "ADD",
            "UPDATE": "UPDATE"
        },
        "WARNINGS": {
            "BANK_ACCOUNTS_NOT_SETUP"  : "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
            "DIRECT_DEBIT_SETUP"       : "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
            "NO_BALANCE_DUE"           : "Current Balance needs to be greater than $0.00.",
            "PAYMENT_ALREADY_SCHEDULED": "A payment has already been scheduled.",
            "DEFAULT"                  : "We are unable to process your changes at this time."
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
                },
                "ADD"   : {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": "EnterAmountInitial"
                        }
                    }
                },
                "UPDATE": {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": "EnterAmountEdit"
                        }
                    }
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
                },
                "ADD"   : {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": "SelectBankAccountInitial"
                        }
                    }
                },
                "UPDATE": {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": "SelectBankAccountEdit"
                        }
                    }
                }
            }
        },
        "ADD"   : {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "MakePaymentInitial"
                },
                "title"           : "Make Payment"
            }
        },
        "UPDATE": {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "MakePaymentEdit"
                },
                "title"           : "Edit Payment"
            }
        }
    };

    appGlobals.PAYMENT_MAINTENANCE_SUMMARY = {
        "CONFIG"  : {
            "title"                : "Payment Summary",
            "processingWarning"    : "Payments scheduled after 3:30PM Eastern Time, on a weekend, or on a holiday will be processed on the NEXT business day.",
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
        "ADD"   : {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "PaymentSummaryInitial"
                }
            }
        },
        "UPDATE": {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "PaymentSummaryEdit"
                }
            }
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
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "PaymentConfirmationInitial",
                    "events": {
                        "paymentActivityLink": ["Payment", "PaymentActivityLinkConfirmation"]
                    }
                }
            }
        },
        "UPDATE": {
            "CONFIG": {
                "ANALYTICS": {
                    "pageName": "PaymentConfirmationEdit",
                    "events": {
                        "paymentActivityLink": ["Payment", "PaymentActivityLinkConfirmation"]
                    }
                }
            }
        }
    };

    appGlobals.PAYMENT_VIEW = {
        "CONFIG": {
            "ANALYTICS"           : {
                "pageName": "PaymentDetails",
                "events": {
                    "cancelPaymentLink"   : ["Payment", "CancelPaymentLink"],
                    "editPaymentLink"     : ["Payment", "EditPaymentLink"],
                    "confirmPaymentCancel": ["Payment", "YESCancelPaymentLink"]
                }
            },
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
            "ANALYTICS"                 : {
                "pageName": "PaymentActivity",
                "events": {
                    "paymentAddBankAccountsNotSetup"   : ["Payment", "OKNoBankAccountLink"],
                    "paymentAddDirectDebitSetup"       : ["Payment", "OKDirectDebitSetupLink"],
                    "paymentAddNoBalanceDue"           : ["Payment", "OKNoBalanceDueLink"],
                    "paymentAddPaymentAlreadyScheduled": ["Payment", "OKPaymentScheduledLink"]
                }
            },
            "title"                     : "Payment Activity",
            "scheduledPaymentsHeading"  : "Scheduled Payments",
            "completedPaymentsHeading"  : "Completed Payments",
            "emptyList"                 : "No Records Found."
        },
        "SEARCH_OPTIONS": {
            "PAGE_NUMBER": 0,
            "PAGE_SIZE"  : 50
        }
    };

    appGlobals.PRIVACY_POLICY = {
        "CONFIG": {
            "title"        : "Privacy Policy",
            "appName"      : "WEX SmartHub Mobile Application",
            "privacyNotice": "Privacy Notice",
            "lastUpdated"  : "Last Updated",
            "lastUpdatedDate" : "2016-11-29T11:05:00-0500",
            "sendEmailLink"   : "mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version ",
            "introduction" : "This privacy notice (this <b>\"Privacy Notice\"</b>) governs your use of the WEX&reg; Fleet SmartHub&trade; mobile application (the <b>\"Application\"</b> or <b>\"App\"</b>). The App is owned by WEX, Inc. (collectively, \"WEX\" or \"we,\" \"us,\" or \"our\") for its commercial customers (each, a <b>\"Customer\"</b>) in connection with the Fleet SmartHub mobile application and services (the <b>\"SmartHub Services\"</b>). ",
            "sectionOne"   : {
                "content": "This Privacy Notice describes:",
                "items": [
                    { "content": "The types of information we may collect from or about you or that you may provide when you install, register with, access or use the App, and" },
                    { "content": "Our practices for collecting, using, maintaining, protecting and disclosing that information and your choices about the collection and use of your information." }
                ]
            },
            "sectionTwo": {
                "content": "Use of the App is governed by our SmartHub Application Terms of Use (the <b>\"Terms of Use\"</b>) for the App. <b>BY INSTALLING, USING OR OTHERWISE ACCESSING THE APP FROM ANY DEVICE, MOBILE OR OTHERWISE, YOU ARE AGREEING TO ABIDE BY THE TERMS AND CONDITIONS OF OUR TERMS OF USE AND THIS PRIVACY NOTICE. IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, DO NOT DOWNLOAD AND/OR ACCESS OUR APP.</b>"
            },
            "sectionThree": {
                "content": "Here are some links to help you navigate our Privacy Notice:",
                "link1"  : "Information we collect",
                "link2"  : "How information is used and shared",
                "link3"  : "Information collection (and tracking) technologies",
                "link4"  : "Your choices and how to opt out",
                "link5"  : "Our analytics partners",
                "link6"  : "Our Do Not Track policy",
                "link7"  : "Account and Application security",
                "link8"  : "Effective date; changes to this Privacy Notice",
                "link9"  : "Children’s privacy",
                "link10" : "Links to other sites",
                "link11" : "Notice to California residents",
                "link12" : "Governing law",
                "link13" : "Contact us",
            },
            "sectionFour": {
                "content": "<b>INFORMATION WE COLLECT.</b> In connection with your use of the App, we collect and store information that you voluntarily provide to us as well as data related to your use of the App. Consent to the collection and use of your information in the manner described in this Privacy Notice will be implied through the download and installation of the App.",
                "items"  : [
                    {
                        "content": "<b>Information You Provide to Us Voluntarily.</b> We collect the following types of information that you provide to us voluntarily when you download the App: your existing WEX account username and password (collectively, your \"Individual Information\")."
                    },
                    {
                        "content": "<b>Usage Data We Collect Automatically.</b> We or our Analytics Partners (as defined and described more fully below) may automatically collect the following types of information about your access and use of the App (collectively, <b>\"Usage Data\"</b>):",
                        "items"  : [
                            { "content": "WEX may partner with select analytics partners, including Google Analytics (<b>\"Analytics Partners\"</b>) to collect information about how our App is used. Our Analytics Partners may collect information about how often you use the App and what features you use. You can learn more about our Analytics Partners in the section titled \"OUR ANALYTICS PARTNERS\" below." },
                            { "content": "When you access and use the App, we will also automatically collect real-time information about the location of your device (including identifiers unique to your device), logs and other communications data relating to your use of the App. We may collect information about your physical location only if (a) \"location services\" for the mobile application is enabled, or (b) the permissions in the mobile device allow communication of this information. If you do not want us to collect your location information, you can opt out of sharing this information by changing the relevant preferences and permissions in your mobile device; however, please note that opting out of the App’s collection of location information will cause its location-based features to be disabled." }
                        ]
                    },
                    {
                        "content": "<b>Aggregate Information.</b> In addition, we automatically collect certain aggregate information and analytical data related to your use of the App. Aggregate information is non-personally identifiable or anonymous information about you, including the date and time of your visit, the phone network associated with your mobile device, your mobile device’s operating system or platform, the type of mobile device you use and the features of our App you accessed (collectively, <b>\"Aggregate Information\"</b>)."
                    }
                ]
            },
            "sectionFive": {
                "title": "HOW INFORMATION IS USED AND SHARED.",
                "items": [
                    {
                        "content": "<b>Use of Information.</b> We use the information we collect to make available the Services, to manage the App and assess its usage, to resolve problems with the App, to respond to inquiries from you, to communicate with you about the Services and/or important changes to the App, this Privacy Notice or the Terms of Use, to review App operations and to improve the content and functionality of the App, to address problems with the App, to protect the security or integrity of the App, our Customers, and our business, and to tailor the App to your and other Customers’ needs."
                    },
                    {
                        "content": "<b>Retention of Information.</b> We will retain Individual Information and Usage Data for as long as you use the App, unless we are required to retain it for a longer period to fulfill a legal requirement or law enforcement need. We will retain Aggregate Information indefinitely and may store it thereafter in the aggregate. If you’d like us to delete your Individual Information that you have provided to the App, please contact us at MobileApplications@wexinc.com and we will respond within a reasonable time."
                    },
                    {
                        "content": "Disclosure of information. We disclose Individual Information and Usage Data as described below; however, we will not sell, rent or lease your Individual Information to any third party. We are not limited in our use of Aggregate Information that does not permit direct association with any specific individual or non-identifiable aggregate information about our users.",
                        "items"  : [
                            { "content": "<b><em>Service Providers/Affiliates.</em></b> We may share the information we collect with companies that provide support services to us. These companies may need the information to perform their functions." },
                            { "content": "<b><em>Acquirors.</em></b> As with any other business, it is possible that in the future we could merge with or be purchased by another company. If we are acquired, the company that acquires us would have access to the information maintained by us but would continue to be bound by this Privacy Notice unless and until it is amended." },
                            { "content": "<b><em>Court Orders and Legal Processes.</em></b> We disclose information, including Individual Information and Usage Data, in response to a subpoena, court order or other comparable legal process." },
                            { "content": "<b><em>Other.</em></b> We may also disclose information in order to (i) protect and defend our rights or property, and/or the rights or property of our Customers, or third parties, as permitted by law, (ii) to detect, prevent or otherwise address fraud, security or technical issues, or (iii) to enforce our Terms of Service." }
                        ]
                    }
                ]
            },
            "sectionSix": {
                "content": "<b>INFORMATION COLLECTION (AND TRACKING) TECHNOLOGIES.</b> The technologies that we or our service providers use for automatic information collection may include:",
                "items"  : [
                    { "content": "<em>Cookies (or mobile cookies)</em>. A cookie is a small file placed on your mobile device. It may be possible to refuse to accept mobile cookies by activating the appropriate setting on your device. However, if you select this setting you may be unable to access certain parts of our application." },
                    { "content": "<em>Web Beacons.</em> Pages of the application and our e-mails may include small electronic files known as web beacons that permit us (or our Analytics Partners), for example, to count users who have visited certain pages and for other related App statistics. " }
                ]
            },
            "sectionSeven": {
                "title": "YOUR CHOICES AND HOW TO OPT-OUT.",
                "items": [
                    { "content": "<b>Geolocation and Push Notifications.</b> You may at any time opt out from further allowing SmartHub to access location data or send you push notifications by adjusting your permissions in your mobile device." },
                    { "content": "<b>Uninstall the App.</b> You can stop all collection of information by the App by uninstalling the App. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network. " }
                ]
            },
            "sectionEight": {
                "content" : "<b>OUR ANALYTICS PARTNERS.</b> WEX uses Analytics Partners who can analyze information regarding your use of the App and help us to improve the quality and relevance of our App and its features. Most Analytics Partners use a variety of techniques to collect de-identified, non-personal information about users of an App such as ours, such as cookies (or mobile cookies), web beacons, and other tracking technologies. These techniques are discussed in the \"INFORMATION COLLECTION (AND TRACKING) TECHNOLOGIES\" section above. For information about the privacy practices of Google Analytics, please go ",
                "hereText": "here"
            },
            "sectionNine": {
                "content": "<b>OUR DO NOT TRACK POLICY.</b> You can opt out of being tracked during your use of the App using your mobile device settings. However, the App’s access to certain information about your use, including your mobile device’s unique device identifier, can only be limited by uninstalling the App. To learn more about internet-based advertising or to opt-out of internet based advertising, please visit the ",
                "websiteNetworkAdvertising": "Network Advertising Initiative website",
                "andThe": "and the",
                "websiteDigitalAdvertising": "Digital Advertising Alliance website"
            },
            "sectionTen": {
                "title": "ACCOUNT AND APPLICATION SECURITY.",
                "contents": [
                    { "content": "The security of your account relies on your protection of your mobile device and your password. You are responsible for maintaining the security of your password. You are solely responsible for any and all activities that occur under your account or on your mobile device. You may not share your password for the App with anyone. We will never ask you to send your password or other sensitive information to us in an email, though we may ask you to enter this type of information on the App interface. If you believe someone else has obtained access to your password, please change it immediately. If you believe that an unauthorized access has already occurred or may occur please report it immediately to MobileApplications@wexinc.com. You must promptly notify us if you become aware that any information provided by or submitted to the App is lost, stolen or used without permission." },
                    { "content": "The App does not store your fleet payment card information, and we do not have direct control over or responsibility for your fleet payment card information." },
                    { "content": "We have implemented reasonable technical and organizational measures designed to deter unauthorized access to and use, destruction of, modification of, or disclosure of other personally identifiable information we collect via the App. Regardless of the precautions taken by us, by you, or by our third party service providers, no data transmitted over the internet or any other public network can be guaranteed to be 100% secure. We cannot ensure or warrant the security of any information you transmit to us and you provide all personally identifiable information via the App at your own risk." }
                ]
            },
            "sectionEleven": {
                "content": "<b>EFFECTIVE DATE; CHANGES TO THIS PRIVACY NOTICE.</b>",
                "effectiveDateOfNotice": "The effective date of this notice is",
                "content2": "Each time you use the App, the current version of the Privacy Notice will apply. Accordingly, when you use the App, you should check the \"Last Updated\" date of this Privacy Notice (which appears at the top of the Privacy Notice) and review any changes since the last version. We will provide notice of material changes by describing where such changes have been made in the Privacy Notice. It may be necessary from time to time for us to modify this Privacy Notice to reflect changes in the way we collect and use information or changes in privacy-related laws, regulations and industry standards."
            },
            "sectionTwelve": {
                "content": "<b>CHILDREN’S PRIVACY.</b> This App and the Services we offer are not directed to persons under the age of 13 and the App should not be downloaded by any person under the age of 13. We do not knowingly collect or solicit information from, market to or accept services from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to remove such information and terminate the child’s account."
            },
            "sectionThirteen": {
                "content": "<b>GOVERNING LAW.</b> This Privacy Notice is governed by the laws of the State of Maine without giving effect to any principles of conflict of law. Please note that the App is designed for compliance with United States data privacy and security regulations. The United States and other countries have not harmonized their privacy regulations. We have written this Privacy Notice to satisfy United States regulations and the users of the App agree to that level of privacy protection and downloading the App to any device is deemed consent to the Privacy Notice."
            },
            "sectionFourteen": {
                "content": "<b>CONTACT US.</b> To contact us with your questions or comments regarding this Privacy Notice or the information collection and dissemination practices of the App, please contact us using one of the following options:",
                "byEmailLabel":   "By e-mail:",
                "byEmailDisplay": "MobileApplications@wexinc.com",
                "contents": [
                    { "content": "By phone: 1-866-544-5796<br><br>" },
                    { "content": "By mail: WEXONLINE<br><br>PO BOX 639<br><br>PORTLAND, ME 04140" }
                ]
            },
            "sectionFifteen": {
                "content": "© COPYRIGHT 2016 | WEX, Inc. ALL RIGHTS RESERVED."
            }
        }
    };

    appGlobals.TERMS_OF_USE = {
        "CONFIG": {
            "title"        : "Terms of Use",
            "lastUpdated"  : "Last Updated",
            "lastUpdatedDate" : "2016-11-29T11:05:00-0500",
            "introduction" : "Here are the WEX Inc. (\"WEX\") Terms of Use (\"Terms of Use\") for the WEX&reg; Fleet SmartHub&trade; mobile application, including the software application that is compatible for use on (i) the iPhone&reg;, iPod&reg;, iPad&reg; mobile devices and other devices operating on the Apple mobile operating system (iOS), and/or (ii) a mobile device operating on the Android&trade; operating system (collectively, the \"App\"). These Terms of Use shall apply to any person (\"you\" or \"your\") who accesses or uses any feature of the App. Your use of the application constitutes your acceptance of the Terms of Use set forth below. WEX may change or supplement the Terms of Use as it deems appropriate and your continued or subsequent access to and use of the App constitutes your acceptance of such modified or supplemented Terms of Use. Any new update or revision of the App provided and/or made available by WEX shall be governed by the Terms of Use.",
            "sectionOne"   : "1. You are granted a non-exclusive, non-sublicensable, non-transferable, personal, limited license to install, access and use the App. You acknowledge that this end user license is between you and WEX, not Apple or Google, and that WEX is solely responsible for the App.",
            "sectionTwo"   : "2. You shall: (i) access and use the App for lawful purposes only; (ii) not sell, lease, rent, assign or otherwise allow any other third party to access or use the App; (iii) not modify, enhance, supplement, decompile, reverse engineer or create derivative works from the App; (iii) not access or use the App for the benefit of a third party; or (iv) not use the App in the development of any products or services to be provided to a third party. This limited right to access and use the App is revocable in the discretion of WEX and all rights, title and interest not expressly granted to you in these Terms of Use are reserved. WEX and you acknowledge that, in the event of any third party claim that the App or your possession and use of the App infringes that third party’s intellectual property rights, WEX, not Apple or Google, will be solely responsible for the investigation, defense, settlement, and discharge of any such intellectual property infringement claim.",
            "sectionThree" : "3. The App is displayed on a wireless web-enabled cell phone or other types of mobile devices (each a \"Mobile Device\"). You acknowledge and agree that WEX may collect, transmit, store, and use technical, location, login or other personal data and related information, including, but not limited to, technical information about your Mobile Device and information regarding your location, that is gathered periodically, to facilitate product support and other services in connection with the App. ",
            "sectionFour"  : "4. App data may be limited to (i) information that is readily available through current WEX systems; (ii) merchant locations where a WEX transaction has been authorized in the last six (6) months; and (iii) price information for transactions which have been authorized at that merchant location in the last 24 hours. WEX is not permitted to include all merchant brands in its price per gallon reporting tools and does not guarantee the accuracy of the price per gallon listed at each location. Price and participation may vary.",
            "sectionFive"  : "5. Due to the wide variety of Mobile Device technology, WEX cannot guarantee that the App will work on all Mobile Devices. You may incur additional fees or charges from your data carrier for accessing the App. WEX PROVIDES THE APP \"AS IS\" AND MAKES NO EXPRESS WARRANTIES, WRITTEN OR ORAL, AND ALL OTHER WARRANTIES ARE SPECIFICALLY EXCLUDED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, RELIABILITY AND ANY WARRANTY ARISING BY STATUTE, OPERATION OF LAW, COURSE OF DEALING OR PERFORMANCE, OR USAGE OF TRADE. Neither Apple nor Google have any warranty obligations whatsoever with respect to the App.",
            "sectionSix"   : "6. Based on the capability of certain Mobile Devices, you may also be able to access tools and functions available to you through certain third-party licenses that have been granted to WEX. WEX MAKES NO REPRESENTATIONS OR WARRANTIES RELATED TO THE ACCURACY OR CURRENCY OF SUCH TOOLS, FUNCTIONS AND SERVICES PROVIDED THROUGH A THIRD-PARTY LICENSE.",
            "sectionSeven" : "7. You accept all risk and responsibility for any losses, damages, and other consequences resulting directly or indirectly from using this App and any information or material available from it. WEX cannot guarantee the accuracy and availability of the App data. Neither WEX nor the developer shall be held liable for any errors and/or delays in the content and use of any App data. You acknowledge that (a) neither Apple nor Google has any obligation to you to furnish any maintenance or support services with respect to the App and that (b) WEX, not Apple or Google, is responsible for addressing any claims of you or any third party relating to the App or your possession and/or use of the App.",
            "sectionEight" : "8. You agree that you will not use the App or any services related thereto for any purposes prohibited by United States law and shall not use or otherwise export or re-export the App. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WEX, ITS AFFILIATES, AND THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS, WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM YOUR ACCESS AND/OR USE OF THE APP, INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, STATUTORY, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF WEX OR ANY WEX REPRESENTATIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
            "sectionNine"  : "9. The Terms of Use set forth the entire understanding and agreement of the parties relating to the subject matter hereof, and supersede any prior or contemporaneous understandings of any kind or nature. The Terms of Use are governed by the internal laws of the State of Maine, without respect to conflict of laws principles. No instance of waiver by WEX of its rights or remedies under the Terms of Use shall imply any obligation to grant any similar, future or other waiver. The provisions of the Terms of Use are severable, and in the event any provision hereof is determined to be invalid or unenforceable, such invalidity or unenforceability shall not in any way affect the validity or enforceability of the remaining provisions hereof. No agency, partnership or joint venture relationship is intended or created between you and WEX as a result of your use of the App. The following provisions shall survive the expiration or termination of the Terms of Use: Sections 2, 5, 6, 7, 8, 9, and 11.",
            "sectionTen"   : "10. You must comply with applicable third party terms of agreement when using the App.",
            "sectionEleven": "11. You agree that Apple (and its subsidiaries) is a third party beneficiary of these Terms of Use and will have the right to enforce these Terms of Use.",
            "closing"      : "If you have any questions or concerns about WEX&reg; Fleet SmartHub&trade; mobile application or our Terms of Use, please e-mail: <a href=\"mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version $VERSION_NUMBER$\">MobileApplications@wexinc.com</a>."
        }
    };

    appGlobals.TRANSACTION_LIST = {
        "CONFIG"        : {
            "ANALYTICS"     : {
                "pageName": "TransactionActivity",
                "events": {
                    "date"  : ["Transaction", "Date"],
                    "card"  : ["Transaction", "CardNumber"],
                    "driver": ["Transaction", "DriverName"],
                    "scroll": ["Transaction", "InfiniteScroll"]
                }
            },
            "title"         : "Transactions",
            "emptyList"     : "No Records Found.",
            "buttonLabels"  : {
                "date"  : "Date",
                "driver": "Driver Name",
                "card"  : "Card Number"
            }
        },
        "SEARCH_OPTIONS": {
            "PAGE_SIZE": 25,
            "PENDING_MAX_DAYS" : 600
        }
    };

    appGlobals.POSTED_TRANSACTION_DETAIL = {
        "CONFIG": {
            "ANALYTICS": {
                "pageName": "TransactionDetails"
            },
            "cardNumber"          : "Card Number",
            "currentOdometer"     : "Odometer",
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

    appGlobals.SETTINGS = {
        "CONFIG": {
            "title": "Settings",
            "events": {
                "acceptTerms" : ["BiometricSettings", "EnableBiometrics", "AcceptTerms"],
                "declineTerms": ["BiometricSettings", "EnableBiometrics", "DeclineTerms"],
                "YesConfirm"  : ["BiometricSettings", "DisableBiometrics", "YesConfirm"],
                "NoConfirm"   : ["BiometricSettings", "DisableBiometrics", "NoConfirm"]
            },
            "platformContent": {
                "android": {
                    "fingerprintAuthName": "fingerprint authentication"
                },
                "ios": {
                    "fingerprintAuthName": "Touch ID®"
                }
            },
            "fingerprintAuthTextLabel": "Use",
            "removeFingerprintProfileConfirm": {
                "message":   "Are you sure you want to turn off <%= fingerprintAuthName %> for your Username <%= username %>?",
                "yesButton": "Yes",
                "noButton":  "No"
            },
            "createFingerprintAuthMessage": "<%= _.capitalize(fingerprintAuthName) %> is now setup for your Username <%= username %>."
        }
    };

    appGlobals.NAV_BAR = {
        "CONFIG": {}
    };

    appGlobals.MENU = {
        "CONFIG": {
            "ANALYTICS": {
                "events": {
                    "makePaymentLink"        : ["Payment", "MakePaymentLinkMenu"],
                    "paymentActivityLink"    : ["Payment", "PaymentActivityLinkMenu"],
                    "transactionActivityLink": ["Transaction", "TransactionActivityLinkMenu"],
                    "cardsLink"              : ["Cards", "CardsLinkMenu"],
                    "driversLink"            : ["Drivers", "DriversLinkMenu"]
                }
            },
            "options": {
                "home"               : "Home",
                "addPayment"         : "Make Payment",
                "payments"           : "Payment Activity",
                "transactionActivity": "Transactions",
                "cards"              : "Cards",
                "drivers"            : "Drivers",
                "notifications"      : "Alerts",
                "contactUs"          : "Contact Us",
                "settings"           : "Settings",
                "terms"              : "Terms of Use",
                "privacyPolicy"      : "Privacy Policy",
                "logOut"             : "Log Out"
            },
            "rootStates": {
                "home"               : "landing",
                "addPayment"         : "payment.maintenance",
                "payments"           : "payment.activity",
                "transactionActivity": "transaction",
                "cards"              : "card",
                "drivers"            : "driver",
                "notifications"      : "notifications",
                "contactUs"          : "contactUs",
                "terms"              : "termsOfUse",
                "privacyPolicy"      : "privacyPolicy",
                "settings"           : "settings"
            }
        }
    };

    appGlobals.BUTTONS = {
        "CONFIG": {
            "cancel": "Cancel",
            "done"  : "Done"
        }
    };

    appGlobals.ONLINE_ENROLLMENT = {
      "CONFIG": {
        "MESSAGES": {
          "ERRORS": {
            "serviceUnavailable": "We are unable to complete your request at this time. Please try again later.",
            "applicationError":   "There was an error. Please try again later."
          }
        },
        "ANALYTICS": {
          "events": {
            "EnrollmentAvailable":    ["OnlineEnrollment", "EnrollNowLink", "EnrollmentAvailable"],
            "EnrollmentNotAvailable": ["OnlineEnrollment", "EnrollNowLink", "EnrollmentNotAvailable"]
          }
        }
      }
    };

    appGlobals.MODAL_TYPES = {
        FINGERPRINT_AUTH_TERMS: {
            "templateUrl": "app/components/user/auth/templates/fingerprintAuthTerms.html",
            "options"    : {
                "backdropClickToClose": false,
                "scopeVars"  : {
                    "CONFIG": {
                        termsIos: "<p><b>Here are the Terms & Conditions for enabling Touch ID&reg; functionality with FLEET SmartHub.</b></p> \
                           <p>To enable Touch ID&reg; for log in, you are required to save your Username on this device. <b>Once Touch ID&reg; is enabled, you understand and agree that any Touch ID&reg; fingerprint stored on this device can be used to access your accounts in FLEET SmartHub.</b></p> \
                           <p>WEX neither controls the functionality of Touch ID&reg; nor has access to your fingerprint information.</p> \
                           <p>There may be circumstances where Touch ID&reg; will not function as expected and we may ask you to log in using password.</p> \
                           <p>By choosing Accept, you agree to these terms and conditions. Choose Decline to cancel set up of Touch ID&reg; for FLEET SmartHub.</p> \
                           <p>Apple, the Apple logo, Touch ID&reg; [iPhone, iPad] are trademarks of Apple Inc., registered in the U.S. and other countries.  App Store is a service mark of Apple Inc.</p> \
                           <p>To enable Touch ID&reg; for log in, you are required to save your Username on this device. Note that Touch ID&reg; allows multiple fingerprints to be stored on your device.</p>",
                        termsAndroid: "<p><b>Here are the Terms & Conditions for enabling fingerprint authentication with FLEET SmartHub.</b></p> \
                               <p>To enable fingerprint authentication for log in, you are required to save your Username on this device. <b>Once fingerprint authentication is enabled, you understand and agree that any fingerprint stored on this device can be used to access your accounts in FLEET SmartHub.</b></p> \
                               <p>WEX neither controls the functionality of fingerprint nor has access to your fingerprint information.</p> \
                               <p>There may be circumstances where fingerprint authentication will not function as expected and we may ask you to log in using your password.</p> \
                               <p>By choosing Accept, you agree to these terms and conditions. Choose Decline to cancel set up of fingerprint authentication for FLEET SmartHub.</p> \
                               <p>Android is a trademark of Google Inc.</p> \
                               <p>To enable fingerprint authentication for log in, you are required to save your Username on this device. Note that fingerprint authentication allows multiple fingerprints to be stored on your device.</p>",
                        "BUTTONS": {
                            "ACCEPT" : "Accept",
                            "DECLINE": "Decline"
                        },
                        "TITLE": "Terms & Conditions"
                    }
                }
            },
            "animation"  : "slide-in-down"
        },
        VERSION_CHECK: {
            "templateUrl": "app/components/user/auth/templates/versionCheckModal.html",
            "options": {
                "backdropClickToClose": false,
                "hardwareBackButtonClose" : false,
                "scopeVars": {
                    "APP_STORES": {
                        android: "com.wex.fleetsmarthub",
                        ios: "id1051414868?ls=1&mt=8"
                    },
                    "CONFIG": {
                        "title": "Update Available",
                        "update": {
                            label: "Update"
                        },
                        "later": {
                            label: "Not Now"
                        }
                    },
                    "FAIL": {
                        "instructionalText1": "A new version of Fleet SmartHub is available.",
                        "instructionalText2": "Please Update to continue using Fleet SmartHub.",
                        "later": {
                            visible: false
                        }
                    },
                    "WARN": {
                        "instructionalText1": "A new version of Fleet SmartHub is available.",
                        "instructionalText2": "Please Update.",
                        "later": {
                            visible: true
                        }
                    }
                }
            },
            "animation": "slide-in-down"
        }
    };

    appGlobals.USER_AUTHORIZATION = {
        ERRORS: {
            "AUTHENTICATION_ERROR": "AUTHENTICATION_ERROR",
            "EXCEEDED_ATTEMPTS"   : "EXCEEDED_ATTEMPTS",
            "TERMS_LOG_FAILED"    : "TERMS_LOG_FAILED",
            "USER_CANCELED"       : "USER_CANCELED",
            "UNKNOWN"             : "UNKNOWN"
        },
        TYPES: {
            "FINGERPRINT": "FINGERPRINT",
            "SECRET"     : "SECRET"
        }
    };

    appGlobals.FINGERPRINT_AUTH = {
        CONFIG: {
            "registerSuccessBanner": "is now setup for your username"
        }
    };

    appGlobals.FEATURE_FLAGS = {
        "PUSH_NOTIFICATIONS": false
    };

    appGlobals.USER_IDLE_TIMEOUT = 900; //in seconds

    appGlobals.GENERIC_TRACKING_ID = "@@@STRING_REPLACE_GOOGLE_ANALYTICS_TRACKING_ID_GENERIC@@@";

    angular
        .module("app.components.core")
        .constant("appGlobals", appGlobals)
        .constant("appGlobalsAndroid", appGlobalsAndroid)
        .constant("appGlobalsIos", appGlobalsIos)
        .factory("globals", globals);

})();
