import { PaymentProvider } from "./api/payment-provider";
import { CardProvider } from "./api/card-provider";
import { AccountProvider } from "./api/account-provider";
import { Fingerprint, FingerprintProfile } from "./fingerprint";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Session, UserCredentials, SessionPartial } from "../models";
import { AuthProvider } from "./api/auth-provider";
import { UserProvider } from "./api/user-provider";
import { Observable } from "rxjs/Observable";

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

export interface SessionInfoOptions {
  forceRequest?: Session.Field[] | boolean;
}

export namespace SessionInfoOptions {
  export const Defaults: SessionInfoOptions = { };
}

type SessionInfoRequestor<T> = (requiredDetails?: SessionPartial) => Observable<T>;

type SessionInfoRequestorDictionary = {
  [sessionField: string]: SessionInfoRequestorDetails;
};

interface SessionInfoRequestorDetails {
  requestor: SessionInfoRequestor<any>;
  requiredFields?: Session.Field[];
}

@Injectable()
export class SessionManager {

  private static _cachedSession: Session;

  private sessionInfoRequestors: SessionInfoRequestorDictionary = {};
  private pendingRequests: { [sessionField: string]: Observable<any> } = {};

  constructor(
    private authProvider: AuthProvider,
    private userProvider: UserProvider,
    private fingerprint: Fingerprint,
    private accountProvider: AccountProvider,
    private cardProvider: CardProvider,
    private paymentProvider: PaymentProvider
  ) {
    this.registerSessionInfoRequestors();
  }

  public static get cachedSession(): Session {
    return this._cachedSession;
  }

  public static get hasSession(): boolean {
    return !!this.cachedSession;
  }

  public static get hasActiveSession(): boolean {
    return this.hasSession && !!this.cachedSession.user;
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

  //TODO - Abstract these out into a separate service
  private registerSessionInfoRequestors() {
    this.sessionInfoRequestors[Session.Field.User] = {
      requestor: () => this.userProvider.current().map(user => user.details)
    };

    this.sessionInfoRequestors[Session.Field.BillingCompany] = {
      requiredFields: [Session.Field.User],
      requestor: (session: SessionPartial) => Observable.if(() => !!session.user.billingCompany,
        this.accountProvider.get(session.user.billingCompany.details.accountId).map(company => company.details),
        Observable.empty()
      )
    };

    this.sessionInfoRequestors[Session.Field.UserCompany] = {
      requiredFields: [Session.Field.User],
      requestor: (session: SessionPartial) => this.accountProvider.get(session.user.company.details.accountId).map(company => company.details)
    };

    this.sessionInfoRequestors[Session.Field.Cards] = {
      requiredFields: [Session.Field.User],
      requestor: (session: SessionPartial) => this.cardProvider.search(session.user.company.details.accountId).map(cards => cards.map(card => card.details))
    };

    this.sessionInfoRequestors[Session.Field.Payments] = {
      requiredFields: [Session.Field.User],
      requestor: (session: SessionPartial) => this.paymentProvider.search(session.user.company.details.accountId, {pageSize: 999, pageNumber: 0})
                                                .map(payments => payments.map(payment => payment.details))
    };
  }

  public getSessionInfo(requiredFields?: Session.Field[], options?: SessionInfoOptions): Observable<SessionPartial> {
    options = _.merge({}, SessionInfoOptions.Defaults, options);
    requiredFields = _.isNil(requiredFields) ? Session.Field.All : requiredFields;
    const errorPrefix = "Error: Cannot get session info:";

    if (!SessionManager.hasSession) {
      return Observable.throw(`${errorPrefix} No active session`);
    }

    if (requiredFields.length === 0) {
      return Observable.of(new SessionPartial());
    }

    // Map each required field to a request to get the value (either from the server or from the cache)
    return Observable.forkJoin(requiredFields.map<Observable<any>>((requiredField: Session.Field) => {
      let requestorDetails = this.sessionInfoRequestors[requiredField];
      let cachedValue = SessionManager._cachedSession.details[requiredField];
      let pendingRequest = this.pendingRequests[requiredField];
      let forceRequest = options.forceRequest === true || _.includes(options.forceRequest as Session.Field[], requiredField);

      // Use the existing request if this value is currently being requested
      if (!!pendingRequest) {
        return pendingRequest;
      }
      // Skip this request if we have already cached this value and we are not forcing a request
      else if (!!cachedValue && !forceRequest) {
        return Observable.of(cachedValue);
      }

      if (_.includes(requestorDetails.requiredFields, requiredField)) {
        return Observable.throw(`${errorPrefix} Requestor requires a reference to itself.`);
      }

      // First request any dependencies on this field, then fetch the requested session field value
      return this.pendingRequests[requiredField] = this.getSessionInfo(requestorDetails.requiredFields || [])
        .flatMap((requiredDetails: SessionPartial) => requestorDetails.requestor(requiredDetails))
        .map((value: any) => SessionManager._cachedSession.details[requiredField] = value) // Update the cached session details
        .finally(() => delete this.pendingRequests[requiredField]) // Remove the pending request
        .publish().refCount(); // Only execute once
    })) // Map the values into a SessionPartial object
      .map((...values: any[]) => new SessionPartial(_.zipObject<any, Partial<Session.Details>>(requiredFields, values[0])));
  }

  public initSession(userCredentials: UserCredentials, options?: SessionOptions): Observable<string> {
    options = _.merge({}, SessionOptions.Defaults, options);

    if (SessionManager.hasSession) {
      this.invalidateSession();
    }

    SessionManager._cachedSession = new Session();

    // Request a new token
    return this.authenticate(userCredentials, options.authenticationMethod)
      .map((token: string) => {
        SessionManager._cachedSession.details.token = token;

        // Pre-fetch remaining session details in the background asynchronously
        this.getSessionInfo().subscribe();

        return token;
      });
  }

  public invalidateSession() {
    SessionManager._cachedSession = null;
    this.pendingRequests = {};
  }
}
