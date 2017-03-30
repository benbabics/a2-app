import * as _ from "lodash";
import { Environment } from "../environments/environment";

export namespace ConstantsInfo {
  export let Env: Map<string, any> = new Map<string, any>();

  export let Common: any = {
    ENV: Environment,
    AUTH: {
      client_id: "mobileAccountManagement",
      grant_type: "password",
      scope: "app_info accounts user:account_management auth_profiles brand_assets cards contact drivers payments:billpay transactions:posted transactions:pending notifications:get notifications:update notifications:delete notifications:unread n:reg accept_touch_id",
    },
    APIS: {
      AMREST: {
        ENDPOINTS: {
          DRIVERS: "drivers",
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
    }
  };
}

ConstantsInfo.Env.set("local", {
  AUTH: {
    client_secret: "fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    client_secret: "fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    client_secret: "fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
    client_secret: "fr?fR)<UP!zD4c<JvtqL28j-3U_Q*mj-XASft<&"
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
