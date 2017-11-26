import { Observable } from "rxjs";
import { Session } from "../../models";

export type SessionInfoRequestor<T, ParamsT = any> = (requiredDetails?: Session, options?: SessionInfoOptions<ParamsT>) => Observable<T>;

export interface SessionInfoRequestorDetails {
  requestor: SessionInfoRequestor<any>;
  requiredFields?: Session.Field[];
  dependentRequestor?: boolean;
}

export type SessionInfoRequestorDictionary = {
  [sessionField: string]: SessionInfoRequestorDetails;
};

export interface SessionInfoOptions<ParamsT> {
  requestParams?: ParamsT;
  clearCache?: boolean;
}

export namespace SessionInfoOptions {
  export const Defaults: SessionInfoOptions<any> = { };
}

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
