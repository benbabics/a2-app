import { Injectable } from "@angular/core";
import { Session, User, UserCredentials } from "../models";
import { AuthProvider } from "./api/auth-provider";
import { UserProvider } from "./api/user-provider";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";


@Injectable()
export class SessionManager {

  private static _currentSession: Session;

  constructor(private authProvider: AuthProvider, private userProvider: UserProvider) {
    console.log("Hello Session Provider");
  }

  public static get currentSession(): Session {
    return this._currentSession;
  }

  public static get hasSession(): boolean {
    return !!this._currentSession;
  }

  public initSession(userCredentials: UserCredentials): Observable<Session> {
    if (SessionManager.hasSession) {
      this.invalidateSession();
    }

    return this.authProvider.requestToken(userCredentials)
      .flatMap((token: string): Observable<User> => {
        //create a temporary session to grab the user object
        SessionManager._currentSession = new Session({ token, user: null });

        return this.userProvider.current();
      })
      .map((user: User): Session => {
        //create the full session object with the user
        return SessionManager._currentSession = new Session({ token: SessionManager._currentSession.token, user });
      }, (error: any) => {
        console.error(error);
      });
  }

  public invalidateSession() {
    SessionManager._currentSession = null;
  }
}
