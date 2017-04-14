import { Fingerprint, FingerprintProfile } from "./fingerprint";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Session, User, UserCredentials } from "../models";
import { AuthProvider } from "./api/auth-provider";
import { UserProvider } from "./api/user-provider";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

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

  private static _currentSession: Session;

  constructor(private authProvider: AuthProvider, private userProvider: UserProvider, private fingerprint: Fingerprint) { }

  public static get currentSession(): Session {
    return this._currentSession;
  }

  public static get hasSession(): boolean {
    return !!this._currentSession;
  }

  public static get hasActiveSession(): boolean {
    return this._currentSession && !!this._currentSession.details.user;
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

    return secret.flatMap((secret: string) => this.authProvider.requestToken({ username: userCredentials.username, password: secret }));
  }

  public initSession(userCredentials: UserCredentials, options?: SessionOptions): Observable<Session> {
    options = _.merge({}, SessionOptions.Defaults, options);

    if (SessionManager.hasSession) {
      this.invalidateSession();
    }

    return this.authenticate(userCredentials, options.authenticationMethod)
      .flatMap((token: string): Observable<User> => {
        //create a temporary session to grab the user object
        SessionManager._currentSession = new Session({ token, user: null });

        return this.userProvider.current();
      })
      .map((user: User): Session => {
        //create the full session object with the user
        return SessionManager._currentSession = new Session({ token: SessionManager._currentSession.details.token, user });
      });
  }

  public invalidateSession() {
    SessionManager._currentSession = null;
  }
}
