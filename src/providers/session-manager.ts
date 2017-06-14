import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Fingerprint, FingerprintProfile } from "./fingerprint";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { UserCredentials } from "@angular-wex/models";
import { AuthProvider, UserProvider } from "@angular-wex/api-providers";
import { Observable } from "rxjs/Observable";
import { SessionCache } from "./session-cache";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { Value } from "../decorators/value";

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

  @Value("STORAGE.KEYS.AUTH_TOKEN") private readonly AUTH_TOKEN_KEY: string;

  private _sessionStateObserver = new BehaviorSubject(null);
  private _willPersistAuthToken: boolean = /[?&]dev/.test( location.search );

  constructor(
    private authProvider: AuthProvider,
    private userProvider: UserProvider,
    private fingerprint: Fingerprint,
    private sessionCache: SessionCache,
    private localStorageService: LocalStorageService,
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

  public restore() {
    SessionCache.cachedValues.token = this.authToken;
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
        this.authToken = token;

        this._sessionStateObserver.next(true);

        // Pre-fetch remaining session details in the background asynchronously
        this.sessionCache.getAllSessionDetails().subscribe();

        return token;
      });
  }

  public invalidateSession() {
    this.sessionCache.clear();
    this.clearAuthToken();

    this._sessionStateObserver.next(false);
  }

  private set authToken(token: string) {
      if (this._willPersistAuthToken) {
          this.localStorageService.set(this.AUTH_TOKEN_KEY, token);
      }
  }

  private get authToken(): string {
      if (this._willPersistAuthToken) {
          return this.localStorageService.get(this.AUTH_TOKEN_KEY) as string;
      }

      return "";
  }

  private clearAuthToken(): void {
      this.localStorageService.remove(this.AUTH_TOKEN_KEY);
  }
}
