import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { UserCredentials } from "@angular-wex/models";
import { Observable } from "rxjs/Observable";
import { SessionCache } from "./session-cache";
import { AuthenticationMethod, AuthenticationManager } from "./authentication-manager";
import { Session } from "../models";

export interface SessionOptions {
  authenticationMethod?: AuthenticationMethod;
}

export namespace SessionOptions {
  export const Defaults: SessionOptions = {
    authenticationMethod: AuthenticationMethod.Secret
  };
}

@Injectable()
export class SessionManager {

  constructor(
    private sessionCache: SessionCache,
    private authenticationManager: AuthenticationManager
  ) { }

  public get cache(): SessionCache {
    return this.sessionCache;
  }

  public restoreFromDevAuthToken() {
    this.cache.updateValue(Session.Field.Token, this.authenticationManager.devAuthToken);
  }

  public initSession(userCredentials: UserCredentials, options?: SessionOptions): Observable<string> {
    options = _.merge({}, SessionOptions.Defaults, options);

    this.cache.sessionState$.take(1).subscribe((session: Session | {}) => {
      if (session) {
        this.invalidateSession();
      }
    });

    // Request a new token
    return this.authenticationManager.authenticate(userCredentials, options.authenticationMethod)
      .finally(() => this.sessionCache.updateAll$().subscribe()); // Pre-fetch remaining session details in the background asynchronously
  }

  public invalidateSession() {
    this.sessionCache.clear();
    this.authenticationManager.clearDevAuthToken();
  }
}
