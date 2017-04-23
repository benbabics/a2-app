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
    KEYMASTER: {
      BASE_URL: "https://account.wexmobile.com/authAPI"
    }
  }
});

export let Constants: any = ((): any => {
  return _.merge({}, ConstantsInfo.Common, ConstantsInfo.Env.get(Environment) || ConstantsInfo.Env.get("local"));
})();
