import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Session } from "../models";
import { SessionManager } from './session-manager';
import { SessionCache } from './session-cache';
import { InvoiceSummary, BankAccount } from "@angular-wex/models";
import { Value } from "../decorators/value";

export type PaymentAmountTypes = keyof {
  minimumPaymentDue: string,
  currentBalance: string
};

export namespace PaymentAmountTypes {
  export const MinimumPaymentDue: PaymentAmountTypes = "minimumPaymentDue";
  export const CurrentBalance: PaymentAmountTypes = "currentBalance";
}

export interface PaymentAmount {
  key: string;
  value: number;
  label: string;
}

Injectable()
export class PaymentService {

  @Value("PAGES.PAYMENTS.ADD.LABELS") private readonly LABELS: any;

  private session: Session = {};

  constructor(
    private sessionManager: SessionManager,
    private sessionCache: SessionCache
  ) {
    this.sessionManager.sessionStateObserver.subscribe(session => {
      session ? this.requestSessionDetails() : this.clearSession();
    });
  }

  public get bankAccounts(): BankAccount[] {
    return this.session.bankAccounts || [];
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  public get paymentDueDate(): string {
    return this.invoiceSummary.details.paymentDueDate;
  }

  public get hasMinimumPaymentDue(): boolean {
    return !!this.invoiceSummary.details.minimumPaymentDue;
  }

  public get amountOptions(): PaymentAmount[] {
    let payments: any = _.pick(this.invoiceSummary.details, PaymentAmountTypes.MinimumPaymentDue, PaymentAmountTypes.CurrentBalance);
    let options = _.map(payments, (value: number, key: string) => {
      return <PaymentAmount>{ key, value, label: this.LABELS[key] };
    });

    // push other amount option
    let otherAmountOption = { value: 0, key: "otherAmount", label: this.LABELS.otherAmount };
    options.push(<PaymentAmount>otherAmountOption);

    return options;
  }

  public get defaultAmount(): PaymentAmount {
    let key = this.hasMinimumPaymentDue ? PaymentAmountTypes.MinimumPaymentDue : PaymentAmountTypes.CurrentBalance;
    return _.first(_.filter(this.amountOptions, { key }));
  }

  public get defaultBankAccount(): BankAccount {
    return _.first(this.bankAccounts);
  }

  private clearSession() {
    this.session = {};
  }

  private requestSessionDetails() {
    let sessionInfo = [Session.Field.InvoiceSummary, Session.Field.BankAccounts];
    this.sessionCache.getSessionDetails(sessionInfo)
      .subscribe((session: Session) => this.session = session);
  }
}
