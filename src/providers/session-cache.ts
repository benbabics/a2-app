import * as _ from "lodash";
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { Session } from "../models";
import { SessionInfoRequestors } from "./session-info-requestor";

export interface SessionInfoOptions {
  forceRequest?: Session.Field[] | boolean;
  requestParams?: object;
  clearCache?: boolean;
}

export namespace SessionInfoOptions {
  export const Defaults: SessionInfoOptions = { };
}

@Injectable()
export class SessionCache {

  private static _cache: Session = {};

  private pendingRequests: { [sessionField: string]: Observable<any> } = {};

  public static get cachedValues(): Session {
    return this._cache;
  }

  constructor(private sessionInfoRequestors: SessionInfoRequestors) {
    this.clear();
  }

  public clear() {
    SessionCache._cache = {};
    this.pendingRequests = {};
  }

  public getAllSessionDetails(options?: SessionInfoOptions): Observable<Session> {
    return this.getSessionDetails(Session.Field.All, options);
  }

  public getSessionDetail(field: Session.Field, options?: SessionInfoOptions): Observable<any> {
    options = _.merge({}, SessionInfoOptions.Defaults, options);
    const errorPrefix = "Error: Cannot get session info:";

    let requestorDetails = this.sessionInfoRequestors.getRequestor(field);
    let pendingRequest = this.pendingRequests[field];

    // Check for cached values/pending requests only if this isn't a dependent requestor
    if (!requestorDetails.dependentRequestor) {
      if (options.clearCache) {
        SessionCache._cache[field] = undefined;
      }

      let cachedValue = SessionCache._cache[field];

      // Use the existing request if this value is currently being requested
      if (!!pendingRequest) {
        return pendingRequest;
      }
      // Skip this request if we have already cached this value and we are not forcing a request
      else if (!_.isNil(cachedValue) && !options.forceRequest) {
        return Observable.of(cachedValue);
      }

      if (_.includes(requestorDetails.requiredFields, field)) {
        return Observable.throw(`${errorPrefix} Requestor requires a reference to itself.`);
      }
    }

    // First request any dependencies on this field, then fetch the requested session field value
    return this.pendingRequests[field] = this.getSessionDetails(requestorDetails.requiredFields || [], requestorDetails.dependentRequestor ? options : null)
      .flatMap((requiredDetails: Session) => requestorDetails.requestor(requiredDetails, options.requestParams))
      .map((value: any) => SessionCache._cache[field] = value) // Update the cached session details
      .finally(() => delete this.pendingRequests[field]) // Remove the pending request
      .publishReplay().refCount(); // Only execute once
  }

  public getSessionDetails(requiredFields: Session.Field[], options?: SessionInfoOptions): Observable<Session> {
    options = _.merge({}, SessionInfoOptions.Defaults, options);

    if (requiredFields.length === 0) {
      return Observable.of({});
    }

    // Map each required field to a request to get the value (either from the server or from the cache)
    return Observable.forkJoin(requiredFields.map<Observable<any>>((requiredField: Session.Field) => {
      return this.getSessionDetail(requiredField, _.merge({}, options, {
        forceRequest: options.forceRequest === true || _.includes(options.forceRequest as Session.Field[], requiredField)
      }));
    })) // Map the values into a SessionPartial object
      .map((...values: any[]) => _.zipObject<any, Session>(requiredFields, values[0]));
  }

  public requestAllSessionDetails(): Observable<Session> {
    return this.getAllSessionDetails({ forceRequest: true });
  }

  public requestSessionDetail(requiredField: Session.Field): Observable<any> {
    return this.getSessionDetail(requiredField, { forceRequest: true });
  }

  public requestSessionDetails(requiredFields: Session.Field[]): Observable<Session> {
    return this.getSessionDetails(requiredFields, { forceRequest: true });
  }
}
