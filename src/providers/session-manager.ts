import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { UserCredentials } from "@angular-wex/models";
import { Observable } from "rxjs/Observable";
import { SessionCache } from "./session-cache";
import { AuthenticationMethod, AuthenticationManager } from "./authentication-manager";

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

  private _sessionStateObserver = new BehaviorSubject(null);

  constructor(
    private sessionCache: SessionCache,
    private authenticationManager: AuthenticationManager
  ) { }

  public static get hasSession(): boolean {
    return !!SessionCache.cachedValues.token;
  }

  public get sessionStateObserver(): Observable<boolean> {
    return this._sessionStateObserver;
  }

  public get cache(): SessionCache {
    return this.sessionCache;
  }

  public restoreFromDevAuthToken() {
    SessionCache.cachedValues.token = this.authenticationManager.devAuthToken;
  }

  public initSession(userCredentials: UserCredentials, options?: SessionOptions): Observable<string> {
    options = _.merge({}, SessionOptions.Defaults, options);

    if (SessionManager.hasSession) {
      this.invalidateSession();
    }

    // Request a new token
    return this.authenticationManager.authenticate(userCredentials, options.authenticationMethod)
      .map((token: string) => {
        SessionCache.cachedValues.token = token;
        this.authenticationManager.devAuthToken = token;

        this._sessionStateObserver.next(true);

        // Pre-fetch remaining session details in the background asynchronously
        this.sessionCache.getAllSessionDetails().subscribe();

        return token;
      });
  }

  public invalidateSession() {
    this.sessionCache.clear();
    this.authenticationManager.clearDevAuthToken();

    this._sessionStateObserver.next(false);
  }
}
