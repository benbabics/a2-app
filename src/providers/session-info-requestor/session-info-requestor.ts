import { Observable } from "rxjs";
import { Session } from "../../models";

export type SessionInfoRequestor<T> = (requiredDetails?: Session, params?: any) => Observable<T>;

export interface SessionInfoRequestorDetails {
  requestor: SessionInfoRequestor<any>;
  requiredFields?: Session.Field[];
  dependentRequestor?: boolean;
}

export type SessionInfoRequestorDictionary = {
  [sessionField: string]: SessionInfoRequestorDetails;
};

export abstract class SessionInfoRequestors {

  protected _requestors: SessionInfoRequestorDictionary = {};

  public get requestors(): SessionInfoRequestorDictionary {
    return this._requestors;
  }

  public setRequestor(field: Session.Field, requestor: SessionInfoRequestorDetails) {
    this._requestors[field] = requestor;
  }

  public getRequestor(field: Session.Field): SessionInfoRequestorDetails {
    return this._requestors[field];
  }
}
