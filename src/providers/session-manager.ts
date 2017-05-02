import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Fingerprint, FingerprintProfile } from "./fingerprint";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { UserCredentials } from "../models";
import { AuthProvider } from "./api/auth-provider";
import { UserProvider } from "./api/user-provider";
import { Observable } from "rxjs/Observable";
import { SessionCache } from "./session-cache";

export enum SessionAuthenticationMethod {
  Secret,
  Fingerprint
}

export interface SessionOptions {
  authenticationMethod?: SessionAuthenticationMethod;
}

export namespace SessionOptions {
  export const Defaults: SessionOptions = {
    authenticationMethod: SessionAuthenticationMethod.Secret
  }
}

@Injectable()
export class SessionManager {

  private _sessionStateObserver = new BehaviorSubject(null);

  constructor(
    private authProvider: AuthProvider,
    private userProvider: UserProvider,
    private fingerprint: Fingerprint,
    private sessionCache: SessionCache
  ) { }

  public static get hasSession(): boolean {
    return !!SessionCache.cachedValues.token;
  }

  public get sessionStateObserver(): Observable<boolean> {
    return this._sessionStateObserver;
  }

  private authenticate(userCredentials: UserCredentials, authenticationMethod: SessionAuthenticationMethod): Observable<string> {
    let secret: Observable<string>;

    switch(authenticationMethod) {
      // Fingerprint
      case SessionAuthenticationMethod.Fingerprint: {
        let options: any = { id: userCredentials.username };
        let isRegistering: boolean = !!userCredentials.password;

        if (isRegistering) {
          options.secret = userCredentials.password;
        }

        //TODO Prompt fingerprint terms after auth for registering
        secret = Observable.if(() => isRegistering, this.authenticate(userCredentials, SessionAuthenticationMethod.Secret), Observable.of(null))
          .flatMap(() => this.fingerprint.verify(options))
          .map((fingerprintProfile: FingerprintProfile): string => fingerprintProfile.secret);

        break;
      }
      // Secret
      case SessionAuthenticationMethod.Secret:
      default: {
        secret = Observable.from([userCredentials.password]);
        break;
      }
    }

    // Request a token with the provided username and secret
    return secret.flatMap((secret: string) => this.authProvider.requestToken({ username: userCredentials.username, password: secret }));
  }

  public get cache(): SessionCache {
    return this.sessionCache;
  }

  public initSession(userCredentials: UserCredentials, options?: SessionOptions): Observable<string> {
    options = _.merge({}, SessionOptions.Defaults, options);

    if (SessionManager.hasSession) {
      this.invalidateSession();
    }

    // Request a new token
    return this.authenticate(userCredentials, options.authenticationMethod)
      .map((token: string) => {
        SessionCache.cachedValues.token = token;

        this._sessionStateObserver.next(true);

        // Pre-fetch remaining session details in the background asynchronously
        this.sessionCache.getAllSessionDetails().subscribe();

        return token;
      });
  }

  public invalidateSession() {
    this.sessionCache.clear();

    this._sessionStateObserver.next(false);
  }
}
