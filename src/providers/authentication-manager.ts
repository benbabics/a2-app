import { Fingerprint, FingerprintProfile } from "./fingerprint";
import { Injectable } from "@angular/core";
import { UserCredentials } from "@angular-wex/models";
import { AuthProvider } from "@angular-wex/api-providers";
import { Observable } from "rxjs/Observable";
import { SessionCache } from "./session-cache";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { Value } from "../decorators/value";
import { WexPlatform } from "./platform";
import { UiNotificationsController } from "./ui-notifications-controller";
import { Session } from "../models";

export enum AuthenticationMethod {
  Secret,
  Fingerprint
}

@Injectable()
export class AuthenticationManager {

  @Value("STORAGE.KEYS.AUTH_TOKEN") private readonly AUTH_TOKEN_KEY: string;
  constructor(
    private authProvider: AuthProvider,
    private fingerprint: Fingerprint,
    private localStorageService: LocalStorageService,
    private platform: WexPlatform,
    private uiNotificationsController: UiNotificationsController,
    private sessionCache: SessionCache
  ) { }

  public authenticate(userCredentials: UserCredentials, authenticationMethod: AuthenticationMethod): Observable<string> {
    let secret: Observable<string>;
    switch (authenticationMethod) {
      // Fingerprint
      case AuthenticationMethod.Fingerprint: {
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
      case AuthenticationMethod.Secret:
      default: {
        secret = Observable.of(userCredentials.password);
        break;
      }
    }
    // Request a token with the provided username and secret
    return secret
      .map((secret: string) => this.sessionCache.updateValue(Session.Field.ClientSecret, secret))
      .flatMap((secret: string) => this.authProvider.requestToken({ username: userCredentials.username, password: secret }))
      .map((token: string) => this.devAuthToken = this.sessionCache.updateValue(Session.Field.Token, token));
  }

  public set devAuthToken(token: string) {
    if (this.platform.isDevMode) {
      this.localStorageService.set(this.AUTH_TOKEN_KEY, token);
    }
  }

  public get devAuthToken(): string {
    if (this.platform.isDevMode) {
      return this.localStorageService.get(this.AUTH_TOKEN_KEY) as string;
    }

    return "";
  }

  public clearDevAuthToken(): void {
    if (this.platform.isDevMode) {
      this.localStorageService.remove(this.AUTH_TOKEN_KEY);
    }
  }

  private registerFingerprintAuthentication(userCredentials: UserCredentials): Observable<any> {
    return this.authenticate(userCredentials, AuthenticationMethod.Secret)
      .flatMap(() => this.uiNotificationsController.promptFingerprintTerms());
  }
}
