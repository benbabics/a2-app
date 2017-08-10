import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Fingerprint, FingerprintProfile } from "./fingerprint";
import * as _ from "lodash";
import { Injectable, Inject } from "@angular/core";
import { UserCredentials } from "@angular-wex/models";
import { AuthProvider } from "@angular-wex/api-providers";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { SessionCache } from "./session-cache";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { Value } from "../decorators/value";
import { FingerprintAuthenticationTermsPage } from "../pages/login/fingerprint-auth-terms/fingerprint-auth-terms";
import { ModalController, App } from "ionic-angular";
import { AppSymbols } from "../app/app.symbols";
import { WexPlatform } from "./platform";

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
  };
}

@Injectable()
export class SessionManager {

  @Value("STORAGE.KEYS.AUTH_TOKEN") private readonly AUTH_TOKEN_KEY: string;

  private _sessionStateObserver = new BehaviorSubject(null);

  constructor(
    @Inject(AppSymbols.RootPage) private rootPage: any,
    private authProvider: AuthProvider,
    private fingerprint: Fingerprint,
    private sessionCache: SessionCache,
    private localStorageService: LocalStorageService,
    private modalController: ModalController,
    private app: App,
    private platform: WexPlatform
  ) { }

  public static get hasSession(): boolean {
    return !!SessionCache.cachedValues.token;
  }

  public get sessionStateObserver(): Observable<boolean> {
    return this._sessionStateObserver;
  }

  private authenticate(userCredentials: UserCredentials, authenticationMethod: SessionAuthenticationMethod): Observable<string> {
    let secret: Observable<string>;
    switch (authenticationMethod) {
      // Fingerprint
      case SessionAuthenticationMethod.Fingerprint: {
        let options: any = { id: userCredentials.username };
        let isRegistering: boolean = !!userCredentials.password;

        if (isRegistering) {
          options.secret = userCredentials.password;
        }
        // Prompt fingerprint terms after auth for registering
        secret = Observable.if(() => isRegistering, this.registerFingerprintAuthentication(userCredentials), Observable.of(true))
          .flatMap((shouldVerify: boolean) => {
            if (shouldVerify) {
              return Observable.fromPromise(this.fingerprint.verify(options))
              .map((fingerprintProfile: FingerprintProfile): string => fingerprintProfile.secret);
            } else {
              return Observable.of(userCredentials.password);
          }});

        break;
      }
      // Secret
      case SessionAuthenticationMethod.Secret:
      default: {
        secret = Observable.of(userCredentials.password);
        break;
      }
    }
    // Request a token with the provided username and secret
    return secret
    .map((secret: string) => SessionCache.cachedValues.clientSecret = secret)
    .flatMap((secret: string) => this.authProvider.requestToken({ username: userCredentials.username, password: secret }));
  }

  private registerFingerprintAuthentication(userCredentials: UserCredentials): Observable<any> {
  return this.authenticate(userCredentials, SessionAuthenticationMethod.Secret)
    .flatMap(() => this.promptFingerprintTerms());
  }

  private promptFingerprintTerms(): Observable<boolean> {
    let modal = this.modalController.create(FingerprintAuthenticationTermsPage);
    modal.present();
    return new Observable<boolean>((observer: Subscriber<boolean>) => {
      modal.onDidDismiss((accepted: boolean) => {
        observer.next(accepted);
        observer.complete();
     });
    });
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

  public logout(params?: any) {
    this.app.getRootNav().setRoot(this.rootPage, params)
      .then(() => this.invalidateSession());
  }


  private set authToken(token: string) {
    if (this.platform.isDevMode) {
      this.localStorageService.set(this.AUTH_TOKEN_KEY, token);
    }
  }

  private get authToken(): string {
    if (this.platform.isDevMode) {
      return this.localStorageService.get(this.AUTH_TOKEN_KEY) as string;
    }

    return "";
  }

  private clearAuthToken(): void {
    if (this.platform.isDevMode) {
      this.localStorageService.remove(this.AUTH_TOKEN_KEY);
    }
  }
}
