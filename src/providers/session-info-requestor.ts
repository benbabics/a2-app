import { PaymentProvider } from "./api/payment-provider";
import { CardProvider } from "./api/card-provider";
import { AccountProvider } from "./api/account-provider";
import { UserProvider } from "./api/user-provider";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Session, SessionPartial } from "../models/session";
import { Model } from "../models/model";

export type SessionInfoRequestor<T> = (requiredDetails?: SessionPartial) => Observable<T>;

export interface SessionInfoRequestorDetails {
  requestor: SessionInfoRequestor<any>;
  requiredFields?: Session.Field[];
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

@Injectable()
export class DefaultSessionInfoRequestors extends SessionInfoRequestors {

  private readonly userRequestor: SessionInfoRequestorDetails = {
    requestor: () => this.extractDetails(this.userProvider.current())
  };

  private readonly billingCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: SessionPartial) => Observable.if(() => !!session.user.billingCompany,
      this.extractDetails(this.accountProvider.get(session.user.billingCompany.details.accountId)),
      Observable.empty()
    )
  };

  private readonly userCompanyRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: SessionPartial) => this.extractDetails(this.accountProvider.get(session.user.company.details.accountId))
  };

  private readonly cardsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: SessionPartial) => this.extractDetailsList(this.cardProvider.search(session.user.company.details.accountId))
  };

  private readonly paymentsRequestor: SessionInfoRequestorDetails = {
    requiredFields: [Session.Field.User],
    requestor: (session: SessionPartial) => this.extractDetailsList(this.paymentProvider.search(session.user.company.details.accountId, { pageSize: 999, pageNumber: 0 }))
  };

  constructor(
    private userProvider: UserProvider,
    private accountProvider: AccountProvider,
    private cardProvider: CardProvider,
    private paymentProvider: PaymentProvider
  ) {
    super();

    this.buildDictionary();
  }

  private buildDictionary() {
    this._requestors[Session.Field.User] = this.userRequestor;
    this._requestors[Session.Field.BillingCompany] = this.billingCompanyRequestor;
    this._requestors[Session.Field.UserCompany] = this.userCompanyRequestor;
    this._requestors[Session.Field.Cards] = this.cardsRequestor;
    this._requestors[Session.Field.Payments] = this.paymentsRequestor;
  }

  private extractDetails<T>(modelRequest: Observable<Model<T>>): Observable<T> {
    return modelRequest.map(model => model.details);
  }

  private extractDetailsList<T>(modelListRequest: Observable<Model<T>[]>): Observable<T[]> {
    return modelListRequest.map(models => models.map(model => model.details));
  }
}
