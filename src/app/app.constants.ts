import * as _ from "lodash";
import { ConstantsConfig } from "@angular-wex/api-providers";
import { Environment } from "../environments/environment";

const INT_MAX_32 = 2 ** 31 - 1;

export namespace ConstantsInfo {

  export const Common = {
    ENV: Environment,
    INT_MAX_32,
    LOCALE: "en-US",
    IONIC_APP_ID: "7a49ff3d",
    // Version number gets replaced after WexAppVersionCheck replaces it, which is required for the app to start.
    VERSION_NUMBER: "MOCK",
    APP_TITLE: "Fleet SmartHub",
    //# Storage
    STORAGE: {
      ID: "FLEET_MANAGER-",
      KEYS: {
        USERNAME: "USERNAME",
        AUTH_TOKEN: "AUTH_TOKEN",
        LAST_TRANSACTION_VIEW: "LAST_TRANSACTION_VIEW"
      }
    },
    //# Authentication
    AUTH: {
      BIOMETRIC: {
        FINGERPRINT: {
          PLATFORM_NAME: {
            android: "Fingerprint authentication",
            ios: "Touch ID"
          },
          defaultDialogMessage: "Scan your fingerprint below to enter your account"
        }
      },
      client_id: "mobileAccountManagement",
      grant_type: "password",
      scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
    },
    //# Buttons
    BUTTONS: {
      OK: "Ok",
      CANCEL: "Cancel",
      CLOSE: "Close",
      YES: "Yes",
      NO: "No",
      DISMISS: "Dismiss"
    },
    //# Card
    CARD: {
      REISSUE_REASON: {
        DISPLAY_NAMES: {
          "DAMAGED": "Damaged",
          "LOST": "Lost",
          "STOLEN": "Stolen",
          "UNKNOWN": "Unknown"
        }
      },
    },
    //# Global error notifications
    GLOBAL_NOTIFICATIONS: {
      serverConnectionError: "Could not connect to server. Please try again later.",
      networkError         : "Lost internet connection.",
      fingerprintSuccess   : {
        message: "<%= platformBiometric %> is now setup for your username <%= username %>",
        duration: 5000
      },
      fingerprintError: {
        message: "There was a problem setting up your ${fingerprintTitle}",
        duration: 5000
      }
    },
    //# Components
    COMPONENTS: {
      LIST: {
        emptySearchLabel: "No Records Found"
      }
    },
    //# Currency
    CURRENCY: {
      FORMAT: "USD"
    },
    //# Date/Time
    DATETIME: {
      DATE_FORMAT: "MM/DD/YYYY",
      DATE_TIME_FORMAT: "MM/DD/YYYY hh:mm:ss A",
      LOCALE: "en-US"
    },
    INFINITE_LIST: {
      DEFAULT_SEARCH_PERIOD: [INT_MAX_32, "y"],
      DEFAULT_PAGE_SIZE: 100
    },
    //# App Navigation
    NAVIGATION: {
      LABELS: {
        "login": "Login",
        "landing": "Home",
        "payments": "Payments",
        "transactions": "Transactions",
        "cards": "Cards",
        "drivers": "Drivers"
      }
    },
    //# Platform
    PLATFORM: {
      CURRENT: "%%=PLATFORM%%",
      ANDROID: "android",
      IOS: "ios",
      MOCK: "mock"
    },
    //# User Idle
    USER_IDLE: {
      TIMEOUT_DURATION: 900 //seconds
    },
    //# App Pages
    PAGES: {
      //# Cards page
      CARDS: {
        listLabels: ["Card Number", "Embossing"],
        searchLabel: "Search Card Number or Embossing",
        greekingData: [
          { left: 3, top: 10, right: 15, bottom: 35 },
          { left: 3, top: 55, right: 15, bottom: 80 },
          { left: 20, top: 20, right: 86, bottom: 32 },
          { left: 20, top: 47, right: 86, bottom: 59 },
          { left: 20, top: 74, right: 86, bottom: 86 }
        ],
        greekedElementCount: 15,

        //# Card Details page
        DETAILS: {
          cardNumber: "Card Number",
          title: "Card Details",
          details: "Details",
          actions: "Actions",
          viewTransactions: "View Transactions",
          reissueCard: "Reissue Card",
          reissueMessage: "Your card has been reissued.",
          reissueMessageDuration: 5000, //ms
          actionStatusTitle: "Select Card Status",
          actionStatusCancel: "Cancel",

          STATUS: {
            COLOR: {
              ACTIVE: "success",
              SUSPENDED: "warning",
              TERMINATED: "danger"
            },
            ICON: {
              ACTIVE: "checkmark-circle",
              SUSPENDED: "information-circle",
              TERMINATED: "close-circle"
            }
          },

          LIST: {
            includedFields: [
              "embossingValue2",
              "embossingValue1",
            ],
            mappedFieldNames: {
              embossingValue2: "Standard Embossing",
              embossingValue1: "Optional Embossing",
            }
          },
          statusOptions: [
            { "id": "ACTIVE",     "label": "Active",     "trackingId": "statusOptionActive", "icon": "checkmark-circle" },
            { "id": "SUSPENDED",  "label": "Suspended",  "trackingId": "statusOptionSuspended", "icon": "information-circle" },
            { "id": "TERMINATED", "label": "Terminated", "trackingId": "statusOptionTerminated", "icon": "close-circle" }
          ],
          statuses: {
            ACTIVE: "ACTIVE",
            SUSPENDED: "SUSPENDED",
            TERMINATED: "TERMINATED"
          },
          bannerStatusChangeSuccess: "Status change successful.",
          bannerStatusChangeFailure: "Status change failed. Please try again.",
          confirmMessageTerminate:   "Are you sure you want to terminate this card?",
        },

        //# Card Reissue page
        REISSUE: {
          title: "Reissue Card",
          shippingAddress: "Shipping Address",
          shippingMethod: "Shipping Method",
          reason: "Reason",
          selectReason: "Select Reason",
          selectShippingMethod: "Select Shipping Method",
          reissueCard: "Reissue Card",
          reissueConfirmationTitle: "Confirmation",
          reissueConfirmationMessage: "Are you sure you want to reissue this card?",
          reissueError: "An error has occurred while trying to reissue your card.",
          orderInfoMessage: "Orders received after 3:00pm Eastern Time may be processed the next business day.",
          poBoxInfoMessage: "Please Note: You have a P.O. Box address listed. Your card will be delivered via regular mail."
        }
      },

      //# Options Page
      OPTIONS: {
        ANALYTICS: {
          EVENTS: {
            disableBiometricsConfirm: ["Biometrics", "DisableBiometrics", "YesConfirm"],
            disableBiometricsDecline: ["Biometrics", "DisableBiometrics", "NoConfirm"]
          }
        },
        title: "Options",
        settings: "Settings",
        support: "Support",
        legal: "Legal",
        fingerprintOptionAndroid: "Fingerprint login",
        fingerprintOptionIOS: "Touch ID®",
        contactUs: "Contact us",
        termsOfUse: "Terms of Use",
        privacyPolicy: "Privacy Policy",
        logOut: "Log out",
        FINGERPRINT_SETTINGS: {
          fingerprintAuthTextLabel: "Use",
          destroyFingerprintProfileConfirmMessage: "Are you sure you want to turn off <%= fingerprintAuthName %> for your username <%= username %>?"
        }
      },
      //# Drivers page
      DRIVERS: {
        listLabels: ["Name", "Driver ID"],
        searchLabel: "Search Name or Driver ID",
        greekingData: [
          {left: 3, top: 10, right: 15, bottom: 35},
          {left: 3, top: 55, right: 15, bottom: 80},
          {left: 20, top: 20, right: 86, bottom: 32},
          {left: 20, top: 47, right: 86, bottom: 59},
          {left: 20, top: 74, right: 86, bottom: 86}
        ],
        greekedElementCount: 15,

        //# Driver Details page
        DETAILS: {
          title:   "Driver Details",
          details: "Details",
          actions: "Actions",
          viewTransactions: "View Transactions",

          STATUS: {
            COLOR: {
              ACTIVE:     "success",
              SUSPENDED:  "warning",
              TERMINATED: "danger"
            },
            ICON: {
              ACTIVE: "checkmark-circle",
              SUSPENDED: "information-circle",
              TERMINATED: "close-circle"
            }
          },

          LABELS: {
            promptId:        "Driver ID",
            cellPhoneNumber: "Mobile Phone",
            emailAddress:    "Email Address"
          },
          statusOptions: [
            { "id": "ACTIVE",     "label": "Active",     "trackingId": "statusOptionActive", "icon": "checkmark-circle" },
            { "id": "TERMINATED", "label": "Terminated", "trackingId": "statusOptionTerminated", "icon": "close-circle" }
          ],
          statuses: {
            ACTIVE: "ACTIVE",
            TERMINATED: "TERMINATED"
          },
          actionStatusTitle:         "Select Driver Status",
          actionStatusCancel:        "Cancel",
          bannerStatusChangeSuccess: "Status change successful.",
          bannerStatusChangeFailure: "Status change failed. Please try again.",
          confirmMessageTerminate:   "Are you sure you want to terminate this driver?",
          statusUpdateMessageDuration: 5000
        }
      },

      //# Landing page
      LANDING: {
        ANALYTICS: {
          PAGE_NAME: "Home",
        },
        BACK_TO_EXIT: {
          "duration": 3000,
          "message": "Press again to exit."
        },
        "title": "Home",
        "summary": "Summary",
        "pending": "Pending",
        "minimumPayment": "Min Payment Due",
        "paymentDueDate": "Due Date",
        "pendingAmount": "Pending",
        "currentBalance": "Current Balance",
        "credit": "Credit",
        "remaining": "Remaining",
        "limit": "Limit"
      },

      //# Login page
      LOGIN: {
        ANALYTICS: {
          EVENTS: {
            errorInactive: ["Login", "InactiveStatus"],
            errorAccountNotReady: ["Login", "AccountNotReadyStatus"],
            errorWrongCredentials: ["Login", "WrongCredentialsStatus"],
            errorPasswordLocked: ["Login", "LockedPasswordStatus"],
            loginManual: ["Login", "LoginSuccessfulManual"],
            loginBiometric: ["Login", "LoginSuccessfulBiometric"],
          }
        },
        userName: {
          label: "Username",
          maxLength: 30
        },
        password: {
          label: "Password",
          maxLength: 30
        },
        rememberMe: {
          label: "Remember Username"
        },
        touchId: {
          disabled: {
            label: {
              android: "Set Up Fingerprint",
              ios: "Set Up Touch ID"
            }
          },
          settingsPrompt: {
            title: "",
            message: {
              android: "Fingerprint authentication must be enabled on your device to use this feature.",
              ios: "Touch ID\u00AE must be enabled on your device to use this feature."
            },
            buttons: {
              cancel: "Cancel",
              settings: "Settings"
            }
          },
          warningPrompt: {
            title: "",
            message: {
              android: "Your fingerprint authentication will be disabled.",
              ios: "Your Touch ID\u00AE will be disabled.",
            },
            buttons: {
              cancel: "Cancel",
              ok: "OK"
            }
          }
        },
        submitButton: "Log In",
        serverErrors: {
          AUTHORIZATION_FAILED: "We're sorry but you are not able to manage your account via the mobile application at this time. Please use Fleet Manager Online, our full feature site.",
          DEFAULT: "Invalid login information. Go online to set up or recover your username and password.",
          PASSWORD_CHANGED: "Invalid login information. Please re-enter your username and password.",
          PASSWORD_EXPIRED: "Invalid login information. Go online to set up or recover your username and password.",
          CONNECTION_ERROR: "Login failed. Please try again later.",
          TOKEN_EXPIRED: "Your session has expired. Please login again.",
          USER_LOCKED: "You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.",
          USER_MUST_ACCEPT_TERMS: "Invalid login information. Go online to set up or recover your username and password.",
          USER_MUST_SETUP_SECURITY_QUESTIONS: "Invalid login information. Go online to set up or recover your username and password.",
          USER_NOT_ACTIVE: "Invalid login information. Go online to set up or recover your username and password."
        },
        sessionTimeOut: "Your session has timed out due to 15 minutes of inactivity. Please login to access your account.",
        enrollment: {
          label1: "Don't have an account?",
          label2: "Enroll Now"
        }
      },

      ONLINE_ENROLLMENT: {
        MESSAGES: {
          ERRORS: {
            serviceUnavailable: "We are unable to complete your request at this time. Please try again later.",
            applicationError:   "There was an error. Please try again later."
          }
        },
        ANALYTICS: {
          events: {
            EnrollmentAvailable:    ["OnlineEnrollment", "EnrollNowLink", "EnrollmentAvailable"],
            EnrollmentNotAvailable: ["OnlineEnrollment", "EnrollNowLink", "EnrollmentNotAvailable"]
          }
        }
      },

      //# Payments page
      PAYMENTS: {
        UNAVAILABILITY_REASONS: {
          default: "We are unable to process your changes at this time.",
          shouldDisplayCurrentBalanceDueMessage: "Current Balance needs to be greater than $0.00.",
          shouldDisplayBankAccountSetupMessage: "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
          shouldDisplayDirectDebitEnabledMessage: "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
          shouldDisplayOutstandingPaymentMessage: "A payment has already been scheduled.",
        },
        listLabels: ["Date", "Amount"],
        greekingData: [
          { left: 3, top: 10, right: 24, bottom: 35 },
          { left: 3, top: 55, right: 24, bottom: 80 },
          { left: 68, top: 10, right: 90, bottom: 35 },
          { left: 68, top: 55, right: 90, bottom: 80 },
        ],
        greekedElementCount: 15,
        title: "Payments",

        //# Payments Details page
        DETAILS: {
          title:         "Payment Details",
          amount:        "Amount",
          bankAccount:   "Bank Account",
          postedDate:    "Date Posted",
          scheduledDate: "Date Scheduled",
          inProcess:     "In Process",
          method:        "Method",
          editButton:    "Edit Payment",
          cancelButton:  "Cancel Payment",
          cancelPaymentConfirmation: {
              content:   "Are you sure you want to cancel this scheduled payment?",
              yesButton: "Yes",
              noButton:  "No"
          }
        },

        //# Add Payment page
        ADD: {
          CREATE: {
            title: "Schedule Payment"
          },
          EDIT: {
            title: "Edit Payment"
          },
          LABELS: {
            bankAccount: "Bank Account",
            currentBalance: "Current Balance",
            due: "Due",
            minimumPaymentDue: "Min Payment Due",
            paymentAmount: "Payment Amount",
            paymentDate: "Payment Date",
            schedulePayment: "Schedule Payment",
            warningAmount: "Amount is less than min payment due",
            warningPaymentDate: "Payment date is after due date"
          },

          //# Add Payment Confirmation page
          CONFIRMATION: {
            title: "Payment Confirmation",

            LABELS: {
              success: "Success!",
              complete: "Complete"
            },

            MESSAGES: {
              confirmationMessage: "Your payment of <strong><%= paymentAmount %></strong> from <strong><%= bankAccount %></strong> is scheduled to be processed on <strong><%= paymentDate %></strong>."
            }
          },
          //# Add Payment Summary page
          SUMMARY: {
            title: "Review Payment",

            LABELS: {
              paymentDetails: "Payment Details",
              paymentAmount: "Payment Amount",
              paymentDate: "Scheduled Date",
              bankAccount: "Bank Account",
              makePayment: "Make Payment"
            },
            MESSAGES: {
              dueDateWarning: "The payment date selected is past the due date.",
              paymentInfo: "Payments scheduled after 3:30PM Eastern Time, on a weekend, or on a holiday will be processed on the <strong>next</strong> business day."
            }
          }
        }
      },

      //# Version Check !Supported Modal
      VERSION_CHECK: {
        APP_STORES: {
          android: "com.wex.fleetsmarthub",
          ios: "id1051414868?ls=1&mt=8"
        },
        TITLE: "Update Available",
        BUTTONS: {
          update: "Update",
          notNow: "Not Now"
        },
        UNSUPPORTED: {
          instructionalText1: "A new version of Fleet SmartHub is available.",
          instructionalText2: "Please Update to continue using Fleet SmartHub.",
        },
        DEPRECATED: {
          instructionalText1: "A new version of Fleet SmartHub is available.",
          instructionalText2: "Please Update.",
        }
      },

      //# Contact Us Page
      CONTACT_US: {
        title          : "Contact Us",
        contentHeading : "Do you have a question or comment?",
        content        : "Send us an email, including your name and the name of your business. A representative will respond as soon as possible.",
        sendEmailButton: {
          android: "Send Email",
          ios: "Send Us an Email"
        },
        sendEmailLink  : "mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version "
      },

      //# Fingerprint Auth Terms Page
      FINGERPRINT_AUTH_TERMS: {
        ANALYTICS: {
          EVENTS: {
            acceptTerms: ["Biometrics", "AcceptTerms"],
            declineTerms: ["Biometrics", "DeclineTerms"]
          }
        },
        BUTTONS: {
          ACCEPT: "Accept",
          DECLINE: "Decline"
        },
        terms: {
          ios: "<p><b>Here are the Terms & Conditions for enabling Touch ID&reg; functionality with FLEET SmartHub.</b></p> \
                <p>To enable Touch ID&reg; for log in, you are required to save your Username on this device. <b>Once Touch ID&reg; is enabled, you understand and agree that any Touch ID&reg; fingerprint stored on this device can be used to access your accounts in FLEET SmartHub.</b></p> \
                <p>WEX neither controls the functionality of Touch ID&reg; nor has access to your fingerprint information.</p> \
                <p>There may be circumstances where Touch ID&reg; will not function as expected and we may ask you to log in using password.</p> \
                <p>By choosing Accept, you agree to these terms and conditions. Choose Decline to cancel set up of Touch ID&reg; for FLEET SmartHub.</p> \
                <p>Apple, the Apple logo, Touch ID&reg; [iPhone, iPad] are trademarks of Apple Inc., registered in the U.S. and other countries.  App Store is a service mark of Apple Inc.</p> \
                <p>To enable Touch ID&reg; for log in, you are required to save your Username on this device. Note that Touch ID&reg; allows multiple fingerprints to be stored on your device.</p>",
          android: "<p><b>Here are the Terms & Conditions for enabling fingerprint authentication with FLEET SmartHub.</b></p> \
                    <p>To enable fingerprint authentication for log in, you are required to save your Username on this device. <b>Once fingerprint authentication is enabled, you understand and agree that any fingerprint stored on this device can be used to access your accounts in FLEET SmartHub.</b></p> \
                    <p>WEX neither controls the functionality of fingerprint nor has access to your fingerprint information.</p> \
                    <p>There may be circumstances where fingerprint authentication will not function as expected and we may ask you to log in using your password.</p> \
                    <p>By choosing Accept, you agree to these terms and conditions. Choose Decline to cancel set up of fingerprint authentication for FLEET SmartHub.</p> \
                    <p>Android is a trademark of Google Inc.</p> \
                    <p>To enable fingerprint authentication for log in, you are required to save your Username on this device. Note that fingerprint authentication allows multiple fingerprints to be stored on your device.</p>"
        },
        title: "Terms & Conditions"
      },

      //# Terms of Use page
      TERMS_OF_USE: {
        title: "Terms of Use",
        lastUpdated: "Last Updated",
        lastUpdatedDate: "2016-11-29T11:05:00-0500",
        introduction: "Here are the WEX Inc. (\"WEX\") Terms of Use (\"Terms of Use\") for the WEX&reg; Fleet SmartHub&trade; mobile application, including the software application that is compatible for use on (i) the iPhone&reg;, iPod&reg;, iPad&reg; mobile devices and other devices operating on the Apple mobile operating system (iOS), and/or (ii) a mobile device operating on the Android&trade; operating system (collectively, the \"App\"). These Terms of Use shall apply to any person (\"you\" or \"your\") who accesses or uses any feature of the App. Your use of the application constitutes your acceptance of the Terms of Use set forth below. WEX may change or supplement the Terms of Use as it deems appropriate and your continued or subsequent access to and use of the App constitutes your acceptance of such modified or supplemented Terms of Use. Any new update or revision of the App provided and/or made available by WEX shall be governed by the Terms of Use.",
        sectionOne: "1. You are granted a non-exclusive, non-sublicensable, non-transferable, personal, limited license to install, access and use the App. You acknowledge that this end user license is between you and WEX, not Apple or Google, and that WEX is solely responsible for the App.",
        sectionTwo: "2. You shall: (i) access and use the App for lawful purposes only; (ii) not sell, lease, rent, assign or otherwise allow any other third party to access or use the App; (iii) not modify, enhance, supplement, decompile, reverse engineer or create derivative works from the App; (iii) not access or use the App for the benefit of a third party; or (iv) not use the App in the development of any products or services to be provided to a third party. This limited right to access and use the App is revocable in the discretion of WEX and all rights, title and interest not expressly granted to you in these Terms of Use are reserved. WEX and you acknowledge that, in the event of any third party claim that the App or your possession and use of the App infringes that third party’s intellectual property rights, WEX, not Apple or Google, will be solely responsible for the investigation, defense, settlement, and discharge of any such intellectual property infringement claim.",
        sectionThree: "3. The App is displayed on a wireless web-enabled cell phone or other types of mobile devices (each a \"Mobile Device\"). You acknowledge and agree that WEX may collect, transmit, store, and use technical, location, login or other personal data and related information, including, but not limited to, technical information about your Mobile Device and information regarding your location, that is gathered periodically, to facilitate product support and other services in connection with the App. ",
        sectionFour: "4. App data may be limited to (i) information that is readily available through current WEX systems; (ii) merchant locations where a WEX transaction has been authorized in the last six (6) months; and (iii) price information for transactions which have been authorized at that merchant location in the last 24 hours. WEX is not permitted to include all merchant brands in its price per gallon reporting tools and does not guarantee the accuracy of the price per gallon listed at each location. Price and participation may vary.",
        sectionFive: "5. Due to the wide variety of Mobile Device technology, WEX cannot guarantee that the App will work on all Mobile Devices. You may incur additional fees or charges from your data carrier for accessing the App. WEX PROVIDES THE APP \"AS IS\" AND MAKES NO EXPRESS WARRANTIES, WRITTEN OR ORAL, AND ALL OTHER WARRANTIES ARE SPECIFICALLY EXCLUDED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, RELIABILITY AND ANY WARRANTY ARISING BY STATUTE, OPERATION OF LAW, COURSE OF DEALING OR PERFORMANCE, OR USAGE OF TRADE. Neither Apple nor Google have any warranty obligations whatsoever with respect to the App.",
        sectionSix: "6. Based on the capability of certain Mobile Devices, you may also be able to access tools and functions available to you through certain third-party licenses that have been granted to WEX. WEX MAKES NO REPRESENTATIONS OR WARRANTIES RELATED TO THE ACCURACY OR CURRENCY OF SUCH TOOLS, FUNCTIONS AND SERVICES PROVIDED THROUGH A THIRD-PARTY LICENSE.",
        sectionSeven: "7. You accept all risk and responsibility for any losses, damages, and other consequences resulting directly or indirectly from using this App and any information or material available from it. WEX cannot guarantee the accuracy and availability of the App data. Neither WEX nor the developer shall be held liable for any errors and/or delays in the content and use of any App data. You acknowledge that (a) neither Apple nor Google has any obligation to you to furnish any maintenance or support services with respect to the App and that (b) WEX, not Apple or Google, is responsible for addressing any claims of you or any third party relating to the App or your possession and/or use of the App.",
        sectionEight: "8. You agree that you will not use the App or any services related thereto for any purposes prohibited by United States law and shall not use or otherwise export or re-export the App. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WEX, ITS AFFILIATES, AND THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS, WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM YOUR ACCESS AND/OR USE OF THE APP, INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, STATUTORY, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF WEX OR ANY WEX REPRESENTATIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        sectionNine: "9. The Terms of Use set forth the entire understanding and agreement of the parties relating to the subject matter hereof, and supersede any prior or contemporaneous understandings of any kind or nature. The Terms of Use are governed by the internal laws of the State of Maine, without respect to conflict of laws principles. No instance of waiver by WEX of its rights or remedies under the Terms of Use shall imply any obligation to grant any similar, future or other waiver. The provisions of the Terms of Use are severable, and in the event any provision hereof is determined to be invalid or unenforceable, such invalidity or unenforceability shall not in any way affect the validity or enforceability of the remaining provisions hereof. No agency, partnership or joint venture relationship is intended or created between you and WEX as a result of your use of the App. The following provisions shall survive the expiration or termination of the Terms of Use: Sections 2, 5, 6, 7, 8, 9, and 11.",
        sectionTen: "10. You must comply with applicable third party terms of agreement when using the App.",
        sectionEleven: "11. You agree that Apple (and its subsidiaries) is a third party beneficiary of these Terms of Use and will have the right to enforce these Terms of Use.",
        closing: "If you have any questions or concerns about WEX&reg; Fleet SmartHub&trade; mobile application or our Terms of Use, please e-mail: <a href=\"mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version $VERSION_NUMBER$\">MobileApplications@wexinc.com</a>."
      },

      //# Privacy Policy page
      PRIVACY_POLICY: {
        title: "Privacy Policy",
        appName: "WEX SmartHub Mobile Application",
        privacyNotice: "Privacy Notice",
        lastUpdated: "Last Updated",
        lastUpdatedDate: "2016-11-29T11:05:00-0500",
        sendEmailLink: "mailto:MobileApplications@wexinc.com?subject=Fleet SmartHub version ",
        introduction: "This privacy notice (this <b>\"Privacy Notice\"</b>) governs your use of the WEX&reg; Fleet SmartHub&trade; mobile application (the <b>\"Application\"</b> or <b>\"App\"</b>). The App is owned by WEX, Inc. (collectively, \"WEX\" or \"we,\" \"us,\" or \"our\") for its commercial customers (each, a <b>\"Customer\"</b>) in connection with the Fleet SmartHub mobile application and services (the <b>\"SmartHub Services\"</b>). ",
        sectionOne: {
          content: "This Privacy Notice describes:",
          items: [
            { content: "The types of information we may collect from or about you or that you may provide when you install, register with, access or use the App, and" },
            { content: "Our practices for collecting, using, maintaining, protecting and disclosing that information and your choices about the collection and use of your information." }
          ]
        },
        sectionTwo: {
          content: "Use of the App is governed by our SmartHub Application Terms of Use (the <b>\"Terms of Use\"</b>) for the App. <b>BY INSTALLING, USING OR OTHERWISE ACCESSING THE APP FROM ANY DEVICE, MOBILE OR OTHERWISE, YOU ARE AGREEING TO ABIDE BY THE TERMS AND CONDITIONS OF OUR TERMS OF USE AND THIS PRIVACY NOTICE. IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, DO NOT DOWNLOAD AND/OR ACCESS OUR APP.</b>"
        },
        sectionThree: {
          content: "Here are some links to help you navigate our Privacy Notice:",
          link1: "Information we collect",
          link2: "How information is used and shared",
          link3: "Information collection (and tracking) technologies",
          link4: "Your choices and how to opt out",
          link5: "Our analytics partners",
          link6: "Our Do Not Track policy",
          link7: "Account and Application security",
          link8: "Effective date; changes to this Privacy Notice",
          link9: "Children’s privacy",
          link10: "Links to other sites",
          link11: "Notice to California residents",
          link12: "Governing law",
          link13: "Contact us",
        },
        sectionFour: {
          content: "<b>INFORMATION WE COLLECT.</b> In connection with your use of the App, we collect and store information that you voluntarily provide to us as well as data related to your use of the App. Consent to the collection and use of your information in the manner described in this Privacy Notice will be implied through the download and installation of the App.",
          items: [
            {
              content: "<b>Information You Provide to Us Voluntarily.</b> We collect the following types of information that you provide to us voluntarily when you download the App: your existing WEX account username and password (collectively, your \"Individual Information\")."
            },
            {
              content: "<b>Usage Data We Collect Automatically.</b> We or our Analytics Partners (as defined and described more fully below) may automatically collect the following types of information about your access and use of the App (collectively, <b>\"Usage Data\"</b>):",
              items: [
                { content: "WEX may partner with select analytics partners, including Google Analytics (<b>\"Analytics Partners\"</b>) to collect information about how our App is used. Our Analytics Partners may collect information about how often you use the App and what features you use. You can learn more about our Analytics Partners in the section titled \"OUR ANALYTICS PARTNERS\" below." },
                { content: "When you access and use the App, we will also automatically collect real-time information about the location of your device (including identifiers unique to your device), logs and other communications data relating to your use of the App. We may collect information about your physical location only if (a) \"location services\" for the mobile application is enabled, or (b) the permissions in the mobile device allow communication of this information. If you do not want us to collect your location information, you can opt out of sharing this information by changing the relevant preferences and permissions in your mobile device; however, please note that opting out of the App’s collection of location information will cause its location-based features to be disabled." }
              ]
            },
            {
              content: "<b>Aggregate Information.</b> In addition, we automatically collect certain aggregate information and analytical data related to your use of the App. Aggregate information is non-personally identifiable or anonymous information about you, including the date and time of your visit, the phone network associated with your mobile device, your mobile device’s operating system or platform, the type of mobile device you use and the features of our App you accessed (collectively, <b>\"Aggregate Information\"</b>)."
            }
          ]
        },
        sectionFive: {
          title: "HOW INFORMATION IS USED AND SHARED.",
          items: [
            {
              content: "<b>Use of Information.</b> We use the information we collect to make available the Services, to manage the App and assess its usage, to resolve problems with the App, to respond to inquiries from you, to communicate with you about the Services and/or important changes to the App, this Privacy Notice or the Terms of Use, to review App operations and to improve the content and functionality of the App, to address problems with the App, to protect the security or integrity of the App, our Customers, and our business, and to tailor the App to your and other Customers’ needs."
            },
            {
              content: "<b>Retention of Information.</b> We will retain Individual Information and Usage Data for as long as you use the App, unless we are required to retain it for a longer period to fulfill a legal requirement or law enforcement need. We will retain Aggregate Information indefinitely and may store it thereafter in the aggregate. If you’d like us to delete your Individual Information that you have provided to the App, please contact us at MobileApplications@wexinc.com and we will respond within a reasonable time."
            },
            {
              content: "Disclosure of information. We disclose Individual Information and Usage Data as described below; however, we will not sell, rent or lease your Individual Information to any third party. We are not limited in our use of Aggregate Information that does not permit direct association with any specific individual or non-identifiable aggregate information about our users.",
              items: [
                { content: "<b><em>Service Providers/Affiliates.</em></b> We may share the information we collect with companies that provide support services to us. These companies may need the information to perform their functions." },
                { content: "<b><em>Acquirors.</em></b> As with any other business, it is possible that in the future we could merge with or be purchased by another company. If we are acquired, the company that acquires us would have access to the information maintained by us but would continue to be bound by this Privacy Notice unless and until it is amended." },
                { content: "<b><em>Court Orders and Legal Processes.</em></b> We disclose information, including Individual Information and Usage Data, in response to a subpoena, court order or other comparable legal process." },
                { content: "<b><em>Other.</em></b> We may also disclose information in order to (i) protect and defend our rights or property, and/or the rights or property of our Customers, or third parties, as permitted by law, (ii) to detect, prevent or otherwise address fraud, security or technical issues, or (iii) to enforce our Terms of Service." }
              ]
            }
          ]
        },
        sectionSix: {
          content: "<b>INFORMATION COLLECTION (AND TRACKING) TECHNOLOGIES.</b> The technologies that we or our service providers use for automatic information collection may include:",
          items: [
            { content: "<em>Cookies (or mobile cookies)</em>. A cookie is a small file placed on your mobile device. It may be possible to refuse to accept mobile cookies by activating the appropriate setting on your device. However, if you select this setting you may be unable to access certain parts of our application." },
            { content: "<em>Web Beacons.</em> Pages of the application and our e-mails may include small electronic files known as web beacons that permit us (or our Analytics Partners), for example, to count users who have visited certain pages and for other related App statistics. " }
          ]
        },
        sectionSeven: {
          title: "YOUR CHOICES AND HOW TO OPT-OUT.",
          items: [
            { "content": "<b>Geolocation and Push Notifications.</b> You may at any time opt out from further allowing SmartHub to access location data or send you push notifications by adjusting your permissions in your mobile device." },
            { "content": "<b>Uninstall the App.</b> You can stop all collection of information by the App by uninstalling the App. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network. " }
          ]
        },
        sectionEight: {
          content: "<b>OUR ANALYTICS PARTNERS.</b> WEX uses Analytics Partners who can analyze information regarding your use of the App and help us to improve the quality and relevance of our App and its features. Most Analytics Partners use a variety of techniques to collect de-identified, non-personal information about users of an App such as ours, such as cookies (or mobile cookies), web beacons, and other tracking technologies. These techniques are discussed in the \"INFORMATION COLLECTION (AND TRACKING) TECHNOLOGIES\" section above. For information about the privacy practices of Google Analytics, please go ",
          hereText: "here"
        },
        sectionNine: {
          content: "<b>OUR DO NOT TRACK POLICY.</b> You can opt out of being tracked during your use of the App using your mobile device settings. However, the App’s access to certain information about your use, including your mobile device’s unique device identifier, can only be limited by uninstalling the App. To learn more about internet-based advertising or to opt-out of internet based advertising, please visit the ",
          websiteNetworkAdvertising: "Network Advertising Initiative website",
          andThe: "and the",
          websiteDigitalAdvertising: "Digital Advertising Alliance website"
        },
        sectionTen: {
          title: "ACCOUNT AND APPLICATION SECURITY.",
          contents: [
            { content: "The security of your account relies on your protection of your mobile device and your password. You are responsible for maintaining the security of your password. You are solely responsible for any and all activities that occur under your account or on your mobile device. You may not share your password for the App with anyone. We will never ask you to send your password or other sensitive information to us in an email, though we may ask you to enter this type of information on the App interface. If you believe someone else has obtained access to your password, please change it immediately. If you believe that an unauthorized access has already occurred or may occur please report it immediately to MobileApplications@wexinc.com. You must promptly notify us if you become aware that any information provided by or submitted to the App is lost, stolen or used without permission." },
            { content: "The App does not store your fleet payment card information, and we do not have direct control over or responsibility for your fleet payment card information." },
            { content: "We have implemented reasonable technical and organizational measures designed to deter unauthorized access to and use, destruction of, modification of, or disclosure of other personally identifiable information we collect via the App. Regardless of the precautions taken by us, by you, or by our third party service providers, no data transmitted over the internet or any other public network can be guaranteed to be 100% secure. We cannot ensure or warrant the security of any information you transmit to us and you provide all personally identifiable information via the App at your own risk." }
          ]
        },
        sectionEleven: {
          content: "<b>EFFECTIVE DATE; CHANGES TO THIS PRIVACY NOTICE.</b>",
          effectiveDateOfNotice: "The effective date of this notice is",
          content2: "Each time you use the App, the current version of the Privacy Notice will apply. Accordingly, when you use the App, you should check the \"Last Updated\" date of this Privacy Notice (which appears at the top of the Privacy Notice) and review any changes since the last version. We will provide notice of material changes by describing where such changes have been made in the Privacy Notice. It may be necessary from time to time for us to modify this Privacy Notice to reflect changes in the way we collect and use information or changes in privacy-related laws, regulations and industry standards."
        },
        sectionTwelve: {
          content: "<b>CHILDREN’S PRIVACY.</b> This App and the Services we offer are not directed to persons under the age of 13 and the App should not be downloaded by any person under the age of 13. We do not knowingly collect or solicit information from, market to or accept services from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to remove such information and terminate the child’s account."
        },
        sectionThirteen: {
          content: "<b>GOVERNING LAW.</b> This Privacy Notice is governed by the laws of the State of Maine without giving effect to any principles of conflict of law. Please note that the App is designed for compliance with United States data privacy and security regulations. The United States and other countries have not harmonized their privacy regulations. We have written this Privacy Notice to satisfy United States regulations and the users of the App agree to that level of privacy protection and downloading the App to any device is deemed consent to the Privacy Notice."
        },
        sectionFourteen: {
          content: "<b>CONTACT US.</b> To contact us with your questions or comments regarding this Privacy Notice or the information collection and dissemination practices of the App, please contact us using one of the following options:",
          byEmailLabel: "By e-mail:",
          byEmailDisplay: "MobileApplications@wexinc.com",
          contents: [
            { content: "By phone: 1-866-544-5796<br><br>" },
            { content: "By mail: WEXONLINE<br><br>PO BOX 639<br><br>PORTLAND, ME 04140" }
          ]
        },
        sectionFifteen: {
          content: "© COPYRIGHT 2016 | WEX, Inc. ALL RIGHTS RESERVED."
        }
      },

      //# Transactions page
      TRANSACTIONS: {
        DATE: {
          listLabels: ["Transactions"],
          greekingData: [
            { left: 3, top: 10, right: 33, bottom: 22 },
            { left: 3, top: 32, right: 33, bottom: 44 },
            { left: 3, top: 54, right: 33, bottom: 66 },
            { left: 3, top: 76, right: 33, bottom: 88 },
            { left: 67, top: 32, right: 90, bottom: 68 },
          ],
          greekedElementCount: 15
        },
        DRIVER_NAME: {
          listLabels: ["Driver Name"],
          greekingData: [
            { left: 3, top: 30, right: 25, bottom: 55 },
          ],
          greekedElementCount: 15
        },
        CARD_NUMBER: {
          listLabels: ["Card Number", "Embossing"],
          greekingData: [
            { left: 3, top: 10, right: 15, bottom: 35 },
            { left: 3, top: 55, right: 15, bottom: 80 },
            { left: 20, top: 20, right: 86, bottom: 32 },
            { left: 20, top: 47, right: 86, bottom: 59 },
            { left: 20, top: 74, right: 86, bottom: 86 }
          ],
          greekedElementCount: 15
        },
        LABELS: {
          pending: "Pending",
          today: "Today",
          yesterday: "Yesterday"
        },
        title: "Transactions",

        //# Transaction Details page
        DETAILS: {
          title:   "Transaction Details",

          LABELS: {
            cardNumber: "Card Number",
            postDate:   "Post Date",
            transDateTime: "Trans Date/Time",
            transId:       "Trans ID",
            grossCost:     "Gross Cost",
            netCost:       "Net Cost",
            productDesc:   "Product Description",
            driverFirstName: "Driver First Name",
            driverLastName:  "Driver Last Name",
            assetId:         "Asset ID",
            odometer:        "Odometer",
            merchantName:    "Merchant Name",
            merchantLocation: "Merchant City, ST"
          }
        }
      }
    }
  };

  interface GoogleAnalyticsConstant {
    GOOGLE_ANALYTICS: {
      TRACKING_ID: string;
    };
  }
  export type CommonConstants = typeof Common;
  export type PartialCommonConstants = {[K in keyof CommonConstants]?: Partial<CommonConstants[K]> };
  export type EnvironmentConstants = ConstantsConfig & PartialCommonConstants & GoogleAnalyticsConstant;

  export const Env: Map<string, EnvironmentConstants> = new Map<string, EnvironmentConstants>();
}

ConstantsInfo.Env.set("local", {
  GOOGLE_ANALYTICS: {
    TRACKING_ID: "UA-71223382-6"
  },
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&",
    client_id: "mobileAccountManagement",
    grant_type: "password",
    scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
  },
  APIS: {
    AMREST: {
      BASE_URL: "http://127.0.0.1:20080"
    },
    GATEKEEPER: {
      BASE_URL: "http://127.0.0.1:29080"
    },
    KEYMASTER: {
      BASE_URL: "http://127.0.0.1:26080"
    },
    ONLINE_ENROLLMENT: {
      // Assumes no "/enrollment/" because that appears to be a tomcat redirect
      BASE_URL: "http://localhost:12080"
    }
  }
});

ConstantsInfo.Env.set("dit", {
  GOOGLE_ANALYTICS: {
    TRACKING_ID: "UA-71223382-6"
  },
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&",
    client_id: "mobileAccountManagement",
    grant_type: "password",
    scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
  },
  APIS: {
    AMREST: {
      BASE_URL: "https://uat.account.wexmobile.com/maintenance"
    },
    GATEKEEPER: {
      BASE_URL: "http://gatekeeper-dit.us-east-1.elasticbeanstalk.com/"
    },
    KEYMASTER: {
      BASE_URL: "http://keymaster-dit.us-east-1.elasticbeanstalk.com/"
    },
    ONLINE_ENROLLMENT: {
      BASE_URL: "http://dit-wex.wexinc.com:12080/enrollment/"
    }
  }
});

ConstantsInfo.Env.set("stage-wex", {
  GOOGLE_ANALYTICS: {
    TRACKING_ID: "UA-71223382-10"
  },
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&",
    client_id: "mobileAccountManagement",
    grant_type: "password",
    scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
  },
  APIS: {
    AMREST: {
      BASE_URL: "https://uat.account.wexmobile.com/maintenance"
    },
    GATEKEEPER: {
      BASE_URL: "https://uat.account.wexmobile.com/configurationAPI"
    },
    KEYMASTER: {
      BASE_URL: "https://uat.account.wexmobile.com/authAPI"
    },
    ONLINE_ENROLLMENT: {
      BASE_URL: "https://uat-wex.wexinc.com/enrollment/"
    }
  }
});

ConstantsInfo.Env.set("stage-aws", {
  GOOGLE_ANALYTICS: {
    TRACKING_ID: "UA-71223382-10"
  },
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&",
    client_id: "mobileAccountManagement",
    grant_type: "password",
    scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
  },
  APIS: {
    AMREST: {
      BASE_URL: "https://uat.account.wexmobile.com/maintenance"
    },
    GATEKEEPER: {
      BASE_URL: "http://gatekeeper-stage.us-east-1.elasticbeanstalk.com"
    },
    KEYMASTER: {
      BASE_URL: "http://keymaster-stage.us-east-1.elasticbeanstalk.com"
    },
    ONLINE_ENROLLMENT: {
      BASE_URL: "https://uat-wex.wexinc.com/enrollment/"
    }
  }
});

ConstantsInfo.Env.set("production-wex", {
  GOOGLE_ANALYTICS: {
    TRACKING_ID: "UA-4082503-35"
  },
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&",
    client_id: "mobileAccountManagement",
    grant_type: "password",
    scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id"
  },
  APIS: {
    AMREST: {
      BASE_URL: "https://account.wexmobile.com/maintenance"
    },
    GATEKEEPER: {
      BASE_URL: "https://account.wexmobile.com/configurationAPI"
    },
    KEYMASTER: {
      BASE_URL: "https://account.wexmobile.com/authAPI"
    },
    ONLINE_ENROLLMENT: {
      BASE_URL: "https://www.myfleetcardlogin.com/enrollment/"
    }
  }
});

export type AppConstants = ConstantsInfo.CommonConstants & ConstantsInfo.EnvironmentConstants;

export function GetCurrentEnvironmentConstants(): ConstantsInfo.EnvironmentConstants {
  return ConstantsInfo.Env.get(Environment.Name);
}

export function AppConstants(): AppConstants {
  return _.merge({}, ConstantsInfo.Common, GetCurrentEnvironmentConstants());
}
