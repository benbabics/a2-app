import * as _ from "lodash";
import { Environment } from "../environments/environment";

export namespace ConstantsInfo {
  export let Env: Map<string, any> = new Map<string, any>();

  export let Common: any = {
    ENV: Environment,
    LOCALE: "en-US",
    AUTH: {
      client_id: "mobileAccountManagement",
      grant_type: "password",
      scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id",
    },
    APIS: {
      AMREST: {
        ENDPOINTS: {
          ACCOUNTS: {
            BASE: "accounts",
            DRIVERS: "drivers",
            INVOICES: {
              CURRENT: "payments/currentInvoiceSummary"
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
    CURRENCY: {
      FORMAT: "USD"
    },
    DATETIME: {
      DATE_FORMAT: "MM/DD/YYYY",
      LOCALE: "en-US"
    },
    PAGES: {
      //# Landing page
      LANDING: {
        BACK_TO_EXIT: {
            "duration": 3000, //ms
            "position": "bottom",
            "message" : "Press again to exit."
        },
        CHART: {
          OPTIONS: {
            animation: true,
            percentageInnerCutout: 70,
            showTooltips: false,
            segmentStrokeWidth: 1,
            scaleOverride: true,
            responsive: false
          },
          COLORS: {
            availableCredit: "#3eb049",
            availableCreditNegative: "#ff0000",
            billedAmount: "#324e5d",
            unbilledAmount: "#34b39d",
            pendingAmount: "#efcc57"
          },
          CONSTANTS: {
            "negativeCreditData": 1 //forces angular-chart.js to render negative/zero credit data as a solid/filled graph
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
        "makePayment": "Make Payment",
        "transactions": "Transactions",
        "cards": "Cards",
        "drivers": "Drivers",
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
          "label": "Remember<br/>Username"
        },
        "touchId": {
          "disabled": {
            "label": {
              "android": "Set Up<br/>Fingerprint",
              "ios": "Set Up<br/>Touch ID"
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
