import * as _ from "lodash";
import { Environment } from "../environments/environment";

export namespace ConstantsInfo {
  export let Env: Map<string, any> = new Map<string, any>();

  export let Common: any = {
    ENV: Environment,
    PLATFORM: "%%=PLATFORM%%",
    LOCALE: "en-US",
    //# Storage
    STORAGE: {
      ID: "FLEET_MANAGER-",
      KEYS: {
        USERNAME: "USERNAME"
      }
    },
    //# OAuth
    AUTH: {
      client_id: "mobileAccountManagement",
      grant_type: "password",
      scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id",
    },
    //# REST service config info
    APIS: {
      AMREST: {
        ENDPOINTS: {
          ACCOUNTS: {
            BASE: "accounts",
            CARDS: {
              BASE: "cards"
            },
            DRIVERS: "drivers",
            INVOICES: {
              CURRENT: "payments/currentInvoiceSummary"
            },
            PAYMENTS: {
              SEARCH: "payments"
            }
          },
          USER: {
            CURRENT: "users/current"
          }
        }
      },
      GATEKEEPER: {
        ENDPOINTS: {
          BRAND_LOGO: "logo"
        }
      },
      KEYMASTER: {
        ENDPOINTS: {
          TOKEN: "uaa/oauth/token"
        }
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
      LOCALE: "en-US"
    },
    //# Fingerprint Authentication
    FINGERPRINT: {
      defaultDialogMessage: "Scan your fingerprint below to enter your account"
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
    //# Buttons
    BUTTONS: {
      OK: "Ok",
      CANCEL: "Cancel",
      YES: "Yes",
      NO: "No"
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
      }
    },
    //# App Pages
    PAGES: {
      //# Cards page
      CARDS: {
        listLabels: ["Card Number", "Embossing"],
        searchLabel: "Search Card Number or Embossing",
        greekingData: [
          {left: 3, top: 10, right: 15, bottom: 35},
          {left: 3, top: 55, right: 15, bottom: 80},
          {left: 20, top: 20, right: 86, bottom: 32},
          {left: 20, top: 47, right: 86, bottom: 59},
          {left: 20, top: 74, right: 86, bottom: 86}
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
          }
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

      //# Landing page
      LANDING: {
        BACK_TO_EXIT: {
          "duration": 3000, //ms
          "position": "bottom",
          "message" : "Press again to exit."
        },
        CHART: {
          OPTIONS: {
            animation: { easing: "easeOutBounce" },
            elements: {
              arc: { borderWidth: 1 }
            },
            cutoutPercentage: 70,
            responsive: false,
            legend: { display: false },
            tooltips: { enabled: false }
          },
          COLORS: {
            availableCredit: "#3eb049",
            availableCreditNegative: "#ff0000",
            billedAmount: "#324e5d",
            unbilledAmount: "#34b39d",
            pendingAmount: "#efcc57"
          },
          CONSTANTS: {
            "negativeCreditData": 1 //forces chart to render negative/zero credit data as a solid/filled graph
          }
        },
        "title": "Fleet SmartHub",
        "availableCredit": "Available",
        "billedAmount": "Billed",
        "unbilledAmount": "Unbilled",
        "paymentDueDate": "Due Date",
        "pendingAmount": "Pending",
        "currentBalance": "Current Balance",
        "statementBalance": "Statement Balance",
        "scheduledPayments": "Scheduled"
      },

      //# Login page
      LOGIN: {
        "title": "Fleet SmartHub",
        "userName": {
          "label": "Username",
          "maxLength": 30
        },
        "password": {
          "label": "Password",
          "maxLength": 30
        },
        "rememberMe": {
          "label": "Remember Username"
        },
        "touchId": {
          "disabled": {
            "label": {
              "android": "Set Up Fingerprint",
              "ios": "Set Up Touch ID"
            }
          },
          "settingsPrompt": {
            "title": "",
            "message": {
              "android": "Fingerprint authentication must be enabled on your device to use this feature.",
              "ios": "Touch ID\u00AE must be enabled on your device to use this feature."
            },
            "buttons": {
              "cancel": "Cancel",
              "settings": "Settings"
            }
          },
          "warningPrompt": {
            "title": "",
            "message": {
              "android": "Your fingerprint authentication will be disabled.",
              "ios": "Your Touch ID\u00AE will be disabled.",
            },
            "buttons": {
              "cancel": "Cancel",
              "ok": "OK"
            }
          }
        },
        "submitButton": "Log In",
        "serverErrors": {
          "AUTHORIZATION_FAILED": "We're sorry but you are not able to manage your account via the mobile application at this time. Please use Fleet Manager Online, our full feature site.",
          "DEFAULT": "Invalid login information. Please check your username and password or go online to set up or recover your username and password.",
          "PASSWORD_CHANGED": "Invalid login information. Please re-enter your username and password.",
          "PASSWORD_EXPIRED": "Invalid login information. Go online to set up or recover your username and password.",
          "CONNECTION_ERROR": "Login failed. Please try again later.",
          "TOKEN_EXPIRED": "Your session has expired. Please login again.",
          "USER_LOCKED": "You have exceeded the number of allowable login attempts. You will need to access your online account to retrieve your username and password.",
          "USER_MUST_ACCEPT_TERMS": "Invalid login information. Go online to set up or recover your username and password.",
          "USER_MUST_SETUP_SECURITY_QUESTIONS": "Invalid login information. Go online to set up or recover your username and password.",
          "USER_NOT_ACTIVE": "Invalid login information. Go online to set up or recover your username and password."
        },
        "sessionTimeOut": "Your session has timed out due to 15 minutes of inactivity. Please login to access your account.",
        "enrollment": {
          "label": "Enroll Now"
        }
      },

      //# Payments page
      PAYMENTS: {
        listLabels: ["Date", "Amount"],
        greekingData: [
          {left: 3, top: 10, right: 24, bottom: 35},
          {left: 3, top: 55, right: 24, bottom: 80},
          {left: 68, top: 10, right: 90, bottom: 35},
          {left: 68, top: 55, right: 90, bottom: 80},
        ],
        greekedElementCount: 15
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
      }
    }
  };
}

ConstantsInfo.Env.set("local", {
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    }
  }
});

ConstantsInfo.Env.set("dit", {
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
  },
  APIS: {
    AMREST: {
      BASE_URL: "http://pwm-wex-178.wrightexpress.com:20080"
    },
    GATEKEEPER: {
      BASE_URL: "http://pwm-wex-178.wrightexpress.com:29080"
    },
    KEYMASTER: {
      BASE_URL: "http://pwm-wex-178.wrightexpress.com:26080"
    }
  }
});

ConstantsInfo.Env.set("stage-wex", {
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    }
  }
});

ConstantsInfo.Env.set("production-wex", {
  AUTH: {
    client_secret: "-fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    }
  }
});

export let Constants: any = ((): any => {
  return _.merge({}, ConstantsInfo.Common, ConstantsInfo.Env.get(Environment) || ConstantsInfo.Env.get("local"));
})();
