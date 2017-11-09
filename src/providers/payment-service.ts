import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Session, UserPaymentAmount, UserPaymentAmountType } from "../models";
import { SessionCache } from "./session-cache";
import { InvoiceSummary, BankAccount } from "@angular-wex/models";

export type PaymentSelectionOption = UserPaymentAmount | BankAccount;

Injectable();
export class PaymentService {

  private session: Session = {} as Session;
  private _amountOptions: UserPaymentAmount[];

  constructor(private sessionCache: SessionCache) {
    this.sessionCache.sessionState$
      .subscribe(session => session ? this.requestSessionDetails() : this.clearSession());
  }

  public get bankAccounts(): BankAccount[] {
    return this.session.bankAccounts || [];
  }

  public get currentBalance(): number {
    return this.invoiceSummary.details.currentBalance;
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  public get paymentDueDate(): string {
    return this.invoiceSummary.details.paymentDueDate;
  }

  public get minimumPaymentDue(): number {
    return this.invoiceSummary.details.minimumPaymentDue;
  }

  public get hasMinimumPaymentDue(): boolean {
    return !!this.minimumPaymentDue;
  }

  public get amountOptions(): UserPaymentAmount[] {
    return this._amountOptions;
  }

  public get defaultAmount(): UserPaymentAmount {
    let type = this.hasMinimumPaymentDue ? UserPaymentAmountType.MinimumPaymentDue : UserPaymentAmountType.CurrentBalance;

    return _.first(_.filter(this.amountOptions, { type }));
  }

  public get defaultBankAccount(): BankAccount {
    return _.first(this.bankAccounts);
  }

  public resolvePaymentAmountType(amount: number): UserPaymentAmountType {
    switch (amount) {
      case this.minimumPaymentDue: return UserPaymentAmountType.MinimumPaymentDue;
      case this.currentBalance: return UserPaymentAmountType.CurrentBalance;
      default: return UserPaymentAmountType.OtherAmount;
    }
  }

  private clearSession() {
    this.session = {} as Session;
  }

  private requestSessionDetails() {
    let sessionInfo = [Session.Field.InvoiceSummary, Session.Field.BankAccounts];
    this.sessionCache.updateSome$(sessionInfo)
      .subscribe((session: Session) => {
        this.session = session;

        // Populate the payment amount options
        this._amountOptions = UserPaymentAmountType.values.map((paymentAmountType) => ({
          type: paymentAmountType,
          value: _.get(this.invoiceSummary.details, paymentAmountType, 0)
        }));
      });
  }
}
