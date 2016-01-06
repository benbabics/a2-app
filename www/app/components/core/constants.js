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
            "ANALYTICS"   : {
                "pageName"   : "Login",
                "events"     : {
                    "successfulLogin"       : ["Login", "LoginSuccessful"],
                    "inactiveStatus"        : ["Login", "InactiveStatus"],
                    "accountNotReadyStatus" : ["Login", "AccountNotReadyStatus"],
                    "wrongCredentialsStatus": ["Login", "WrongCredentialsStatus"],
                    "lockedPasswordStatus"  : ["Login", "LockedPasswordStatus"]
                },
                "errorEvents": {
                    "USER_MUST_ACCEPT_TERMS"            : "inactiveStatus",
                    "USER_MUST_SETUP_SECURITY_QUESTIONS": "inactiveStatus",
                    "USER_NOT_ACTIVE"                   : "inactiveStatus",
                    "AUTHORIZATION_FAILED"              : "accountNotReadyStatus",
                    "DEFAULT"                           : "wrongCredentialsStatus",
                    "USER_LOCKED"                       : "lockedPasswordStatus"
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
            "submitButton": "Log In",
            "serverErrors": {
                "AUTHORIZATION_FAILED"              : "We're sorry but you are not able to manage your account via the mobile application at this time. Please use Fleet Manager Online, our full feature site.",
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
            "ANALYTICS"   : {
                "pageName": "Home",
                "events": {
                    "makePaymentLink"        : ["Payment", "MakePaymentLinkHome"],
                    "cardsLink"              : ["Cards", "CardsLinkHome"],
                    "transactionActivityLink": ["Transaction", "TransactionActivityLinkHome"]
                }
            },
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
            "ANALYTICS"         : {
                "pageName": "CardDetails"
            },
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
            "ANALYTICS"        : {
                "pageName": "Cards",
                "events": {
                    "searchSubmitted": ["Cards", "SearchCardLink"]
                }
            },
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
            "noScheduledPaymentsMessage": "There are currently no payments scheduled.",
            "completedPaymentsHeading"  : "Completed Payments",
            "noCompletedPaymentsMessage": "There are currently no payments completed."
        },
        "SEARCH_OPTIONS": {
            "PAGE_NUMBER": 0,
            "PAGE_SIZE"  : 50
        }
    };

    appGlobals.PRIVACY_POLICY = {
        "CONFIG": {
            "title"             : "Privacy Policy",
            "introduction"      : "Privacy Policy for Commercial Customers of WEX Inc. and its wholly owned subsidiaries, including, WEX Financial Services Corporation and WEX Fueling Solutions, Inc. (hereinafter collectively referred to as \"WEX\" or \"we\", \"us\" or \"our\") recognize the importance of protecting your privacy and safeguarding the confidentiality of your sensitive information. This policy discloses what information we gather, how we use that information, how and why we may share that information, and other important information.",
            "sectionOneHeader"  : "Information That We Collect",
            "sectionOne"        : "WEX collects information: (i) from you and from certain third parties when you submit a commercial credit application or enter into a credit agreement with us; (ii) in the form of transaction data when you use our cards; (iii) when you submit a request for information about our programs via email or in response to one of our marketing campaigns; (iv) through the use of web tracking software; and (v) from third parties to help us identify products and services which may be useful to you. We seek to maintain accurate, complete, and up-to-date information. You may contact us through our Customer Service department to request access to identifiable information that we have collected regarding you or your business or to notify us of changes to such information. If you request any such changes, we will contact you by email or fax to confirm whether the changes have been or can be made as requested.",
            "sectionTwoHeader"  : "Card Program Applications",
            "sectionTwoPt1"     : "WEX offers a variety of card programs. These programs include the WEX Universal Fleet Card, co-branded or private label card programs, and the WEX Financial Services Corporation MasterCard (hereinafter collectively referred to as \"Card Program(s)\"). We collect application information from you when you complete an application for one of our card products. The information contained in the application typically includes, but is not limited to, company information (such as the company's name, address, taxpayer identification number, and contact information), billing information (such as the business representative's name and address) and business credit information (such as the name and title of a principal in the business, the type of business, how long the business has been in existence, year of incorporation, and the business' bank and trade references).",
            "sectionTwoPt2"     : "In the event that you provide this information to us via our on-line application on our website, please be aware that we utilize database technology that is capable of retaining information entered in our on-line application, even if you do not submit the application. If you are not certain that you want to submit the application on-line, we encourage you to print out the application form so that you may complete it at your convenience and submit it via regular mail or facsimile transmission.",
            "sectionTwoPt3"     : "Transaction Data: When you use your Card, we collect transaction data. Such data typically includes the following information:",
            "sectionTwoPt4"     : "- Name of cardholder<br>- Transaction date<br>- Card/account number<br>- Total dollar amount of transaction<br>- Vehicle number, if any<br>- Driver identification number, if any<br>- Vehicle odometer reading, if any, as entered by the cardholder<br>- Amount of fuel purchased, if any<br>- Price per gallon of fuel purchased, if any<br>- Non-fuel items purchased, if any<br>- User established product restrictions, if any<br>- Merchant at which the transaction occurred<br>- For certain programs, cardholder contact information<br><br>This information is sent to WEX as a result of the purchases that are made using our Card Programs and may be collected by the merchant where you made the purchase, or by third parties not having a direct contractual relationship with WEX (e.g. a third party network provider for the merchant where you made the purchase). <br><br>Information Requests: You may request information about our programs through our website or in response to marketing campaigns. The information that you are asked to provide in such a request includes your contact information (such as name, title, the name and address of your business, phone number, fax number, e-mail address) and company information (such as type of company, number of vehicles, number of employees, and primary fueling method). <br><br>Web Tracking Software: We use web tracking software that allows us to collect and store information such as the name of the domain from which you access the Internet, the date and time that you access our site, the Internet address of the website from which you linked to our site, and the pages that you visited while on our web site.<br> Supplemental Information: We may supplement the information that you provide with additional information we receive from third parties, including service providers, credit bureaus and industry trade groups. We treat any supplemental information we receive from third parties as carefully as the information that you provide to us directly. As part of our application process, you may authorize us to collect certain consumer reports or personal information that we will collect and rely upon in connection with your application for a commercial charge or credit account with us.",
            "sectionThreeHeader": "How we use the information we collect",
            "sectionThree"      : "WEX uses the information you provide in connection with a Card Program application for the specific purpose of evaluating your creditworthiness with regard to such application, as well as to collect and verify certain information which is required by lending or banking laws for us to create an account for you. WEX may also use the information that you provide, such as your postal/mailing address and/or email address, to send you promotions or solicitations for products or services. Information collected through our database technology in connection with incomplete online applications is used to gauge your interest in our products and to assist us in our marketing efforts and our ability to better serve our customers. We use transaction data gathered when you use your Card for the purpose of processing the transactions. The transaction data is critical to our ability to provide billing and reporting to you. Depending on the Card Program that you have chosen, you may have paper, electronic or online billing and reporting options. In addition, we may use transaction information that we collect from our customers for marketing or other promotional purposes. If you have provided information to us as part of an information request, WEX may use that information to assist in responding to your request or collect such information for marketing or other promotional purposes. WEX uses the information collected as a result of our web tracking software to help diagnose problems with our server, to track user traffic patterns, and to administer our website. This information allows us to determine which areas are of most interest and use to our visitors, which avenues of site promotion are most effective and at what time we can expect peak usage. WEX may use aggregated application information or transaction data for internal and external analytical purposes, including marketing purposes. However, aggregated information and data will not be identified with any particular applicant, individual customer or individual cardholder.",
            "sectionFourHeader" : "With whom we share the information we collect",
            "sectionFour"       : "Our employees have access to the information that we collect from you. All employees of WEX are required to maintain and keep all such information confidential and to abide by the terms of this Privacy Policy. WEX may from time to time retain the services of third-party technical service providers and consultants. These third parties are only allowed access to the information that we collect to the extent that is required for them to perform the tasks for which they were retained. These third parties are contractually obligated to maintain confidentiality and further must agree to be bound by this Privacy Policy. WEX has agreements with certain companies (such as fuel providers or vehicle leasing companies) to offer co-branded and private label charge card programs. If you participate in one of our co-branded or private label card programs, specific information about you and/or your account may be shared with the sponsor of the card program that you have elected to use for your card provider. For example, WEX performs credit adjudication services on behalf of some of these program sponsors. In these instances, WEX may submit application processing status reports to the program sponsor. These status reports are intended to measure our performance on behalf of the program sponsor and contain limited customer information. These reports do include the name of the customer, the date(s) that the customer’s application was reviewed, whether the application was approved or denied, and may include comments detailing actions taken or expected to be taken to complete the review of the application. If a customer uses a co-branded or private label card, the program sponsor is given limited access to transaction data that allows them to determine what products are purchased by the customer and to tailor their services accordingly. In connection with the adjudication of any credit application, we may disclose the information contained in the application to credit bureaus, credit references and other sources disclosed by the applicant for the purpose of evaluating the creditworthiness and verifying the identity of the applicant. Furthermore, we reserve the right to provide information related to our own business relationship with you to credit bureaus or related sources. WEX utilizes third party collection agencies to assist us in recovering against delinquent accounts. We disclose only that information that is necessary for such collection agencies to perform the services for which they were hired. Such information routinely includes the name, address and phone number of the accountholder, account balance, payment history, and details concerning previous internal collection efforts. Subject to applicable legal restrictions, WEX may share certain information that we have collected about our commercial customers to third parties for marketing purposes if we reasonably believe that such third parties can offer products or services that would be beneficial to those customers. We do not rent or sell your email address to third parties. WEX may disclose or exchange with third parties any information that you have provided to us if we believe in good faith that the law requires us to do so or if it is necessary to protect the rights or property of WEX or our users. Additionally, as we continue to grow as a business, we may acquire or be acquired by another company. In such a transaction, customer information will most likely be one of the transferred assets.",
            "sectionFiveHeader" : "Additional privacy issues",
            "sectionFivePt1"    : "Consumer Privacy Rules: The objective of this Privacy Policy is to provide you with a clear, concise and accurate statement of how we handle your information. Please note that most of our Card programs are intended to be used only for commercial and business purposes. As these products and services are not intended to be used for personal, family or household purposes. Consumer privacy protection laws and regulations, do not apply to our information handling practices for these programs. This Privacy Policy is not a statement of intent to be bound by or comply with such laws and regulations. In the event that you have elected to participate in a consumer-purpose card program that is subject to these legal requirements, such as a stored value card or debit card, additional disclosures regarding the treatment of your information will be provided to you separately.",
            "sectionFivePt2"    : "Security: WEX recognizes the importance of secure online interaction, and we utilize a number of methods to safeguard your transmissions. Our website is hosted on secure servers with firewall protection. WEX uses SSL encryption technology on our website and information that is gathered is stored within secure databases protected by multiple firewalls. As effective as current encryption technology is, however, no security system is impenetrable. We cannot guarantee the security of our databases, nor can we guarantee that the information provided via our website will not be intercepted while being transmitted to us over the Internet.",
            "sectionFivePt3"    : "Email: WEX may use your email address for the following types of email communications:<br> Email Service Notifications – We may need to send you information about changes to your account(s), system errors or outages.<br>Occasional Updates – We may send you email updates about our products and services as well as valuable offers.<br>Regularly Scheduled Email Newsletter – We may send you an email newsletter that includes helpful tips to maximize the benefits of your account, fuel price trends, new accepting merchants, information about our products and services, valuable offers, survey questions and results.<br>WEX Inc. does not send unsolicited \"junk\" email (spam). At WEX, we respect your privacy and do not sell or rent your email address to third parties. If you wish to unsubscribe (or opt-out) of receiving marketing emails from WEX, see the \"unsubscribe\" link at the bottom of those email messages you receive. Please note that we will continue to send you email service notifications that are related to your account(s). These include emails that provide account information, answer your questions about a product or service, send information that you have subscribed to receive, facilitate or confirm a sale, or fulfill a legal or regulatory disclosure requirement. This is in compliance with the CAN-SPAM Act of 2003. <br><br>\"Cookies\": Our website makes use of a standard feature of browser software called a \"cookie\" to assign each visitor a unique, random number. A cookie is a file that identifies a computer as a unique user. Cookies may be used to facilitate your use of our website, to maintain site security and to improve our website. Most browsers are initially set up to accept cookies. You may be able to reset your browser to refuse all cookies or to indicate when a cookie is being sent. If cookies are disabled, however, our website (and other websites) may be harder to use. A cookie cannot read data stored on the hard drive of a computer. Links to Other Sites; Our website contains links to other sites whose information practices may be different than ours. You should consult the other sites' privacy notices as WEX has no control over information that is submitted to, or collected by, these third parties and how that information is used.<br><br> Children: We provide business services and do not intend to collect or knowingly collect any information from or about children. It is possible that a child may impersonate a company representative and attempt to apply for a Card and, in so doing, provide the child’s name, address, phone number, fax number, email address and other identifying information. When such information is received and we are aware that the individual providing the information is a child, the information is used only to reject the child’s application and is immediately deleted by us. WEX cannot always determine if a visitor to its website or the sender of an email is a child.",
            "sectionSixHeader"  : "Privacy Policy Changes",
            "sectionSix"        : "We reserve the right to change our policies (including this Privacy Policy) at any time. If we decide to change this Privacy Policy, we will post such changes to our website so that you may be aware of our actions. Any change to this Privacy Policy will become effective thirty (30) days after it is initially posted on our website.",
            "sectionSevenHeader": "Your acceptance of the terms of your privacy policy",
            "sectionSeven"      : "Continued use of our Cards, or your use of our website(s), signify your agreement to this Privacy Policy. If you do not agree with this Privacy Policy you should not use our website(s) or continue to use the Cards."
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
            "ANALYTICS"     : {
                "pageName": "TransactionActivity"
            },
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
            "ANALYTICS": {
                "pageName": "TransactionDetails"
            },
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
            "ANALYTICS": {
                "events": {
                    "makePaymentLink"        : ["Payment", "MakePaymentLinkMenu"],
                    "paymentActivityLink"    : ["Payment", "PaymentActivityLinkMenu"],
                    "transactionActivityLink": ["Transaction", "TransactionActivityLinkMenu"],
                    "cardsLink"              : ["Cards", "CardsLinkMenu"]
                }
            },
            "options": {
                "home"               : "Home",
                "addPayment"         : "Make Payment",
                "payments"           : "Payment Activity",
                "transactionActivity": "Transaction Activity",
                "cards"              : "Cards",
                "contactUs"          : "Contact Us",
                "terms"              : "Terms of Use",
                "privacyPolicy"      : "Privacy Policy",
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
