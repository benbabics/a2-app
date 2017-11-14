import * as _ from "lodash";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Session } from "../models";
import { SessionInfoRequestors } from "./session-info-requestor";

export interface SessionInfoOptions {
  requestParams?: object;
  clearCache?: boolean;
}

export namespace SessionInfoOptions {
  export const Defaults: SessionInfoOptions = { };
}

@Injectable()
export class SessionCache {

  private static _session$ = new BehaviorSubject<Session | {}>({});

  private pendingRequests$ = new BehaviorSubject<{ [sessionField: string]: Observable<any> }>({});

  public static get sessionState$(): Subject<Session | {}> {
    return this._session$;
  }

  constructor(private sessionInfoRequestors: SessionInfoRequestors) {
    this.clear();
  }

  public get sessionState$(): Observable<Session | {}> {
    return SessionCache.sessionState$.asObservable();
  }

  public get session$(): Observable<Session> {
    return this.sessionState$.filter(Boolean);
  }

  public getField$<T>(field: Session.Field): Observable<T> {
    return this.session$.map(session => session[field] as any as T).distinctUntilChanged();
  }

  public getUpdatedField$<T>(field: Session.Field): Observable<T> {
    return this.update$(field).map(session => session[field] as any as T);
  }

  public getRequiredField$<T>(field: Session.Field): Observable<T> {
    return this.require$(field).map(session => session[field] as any as T);
  }

  public clear() {
    this.pendingRequests$.next({});
    SessionCache._session$.next({});
  }

  public getFieldUpdater$(field: Session.Field): Observable<Observable<any> | undefined> {
    return this.pendingRequests$.asObservable().map(pendingRequests => pendingRequests[field]);
  }

  public isUpdatingField$(field: Session.Field): Observable<boolean> {
    return this.getFieldUpdater$(field).map(Boolean).distinctUntilChanged();
  }

  public onFieldUpdating$(field: Session.Field): Observable<void> {
    return this.isUpdatingField$(field).filter(Boolean);
  }

  public require$(field: Session.Field, options?: SessionInfoOptions): Observable<Session> {
    return this.session$
      .take(1)
      .flatMap(session => {
        if (session[field]) {
          return Observable.of(session);
        }
        else {
          return this.update$(field, options);
        }
      });
  }

  public requireAll$(options?: SessionInfoOptions): Observable<Session> {
    return this.requireSome$(Session.Field.All, options);
  }

  public requireSome$(fields: Session.Field[], options?: SessionInfoOptions): Observable<Session> {
    if (fields.length === 0) {
      return this.session$.take(1);
    }
    else {
      return Observable.forkJoin(fields.map(field => this.require$(field, options)))
        .flatMap(() => this.session$.take(1));
    }
  }

  public update$(field: Session.Field, options?: SessionInfoOptions): Observable<Session> {
    options = _.merge({}, SessionInfoOptions.Defaults, options);
    const errorPrefix = "Error: Cannot update session info:";

    let requestorDetails = this.sessionInfoRequestors.getRequestor(field);

    // Check for cached values/pending requests only if this isn't a dependent requestor
    if (!requestorDetails.dependentRequestor) {
      if (options.clearCache) {
        this.updateValue(field, undefined);
      }

      if (_.includes(requestorDetails.requiredFields, field)) {
        return Observable.throw(`${errorPrefix} Requestor requires a reference to itself.`);
      }
    }

    return this.pendingRequests$.asObservable().take(1).flatMap((pendingRequests) => {
      let pendingRequest$ = pendingRequests[field];

      if (pendingRequest$) {
        // Use the existing request if this value is currently being requested
        return pendingRequest$;
      }
      else {
        // First request any dependencies on this field, then fetch the requested session field value
        pendingRequest$ = this.requireSome$(requestorDetails.requiredFields || [], requestorDetails.dependentRequestor ? options : null)
          .flatMap((requiredDetails: Session) => requestorDetails.requestor(requiredDetails, options.requestParams))
          .map((value: any) => this.updateValue(field, value)) // Update the session value
          .map(() => this.clearFieldUpdater(field)) // Remove the pending request
          .flatMap(() => this.session$.take(1)) // Get the newly updated Session
          .shareReplay(1);

        this.pendingRequests$.next(Object.assign(pendingRequests, { [field]: pendingRequest$ }));
        return pendingRequest$;
      }
    });
  }

  public updateAll$(options?: SessionInfoOptions): Observable<Session> {
    return this.updateSome$(Session.Field.All, options);
  }

  public updateSome$(requiredFields: Session.Field[], options?: SessionInfoOptions): Observable<Session> {
    options = _.merge({}, SessionInfoOptions.Defaults, options);

    if (requiredFields.length === 0) {
      return this.session$.take(1);
    }

    // Update each required field
    return Observable.forkJoin(requiredFields.map(requiredField => this.update$(requiredField, options)))
      .flatMap(() => this.session$.take(1));
  }

  /** @internal */
  public updateValue<T>(field: Session.Field, value: T): T {
    this.session$
      .take(1)
      .subscribe(session => SessionCache._session$.next(Object.assign(session, { [field]: value })));
    return value;
  }

  private clearFieldUpdater(field: Session.Field) {
    return this.pendingRequests$.asObservable().take(1).subscribe(pendingRequests => {
      this.pendingRequests$.next(Object.assign(pendingRequests, { [field]: undefined }));
    });
  }
}
