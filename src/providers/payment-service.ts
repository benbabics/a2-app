import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Session, UserPaymentAmount, UserPaymentAmountType } from "../models";
import { SessionCache } from "./session-cache";
import { InvoiceSummary, BankAccount } from "@angular-wex/models";
import { Observable } from "rxjs";

export type PaymentSelectionOption = UserPaymentAmount | BankAccount;

@Injectable()
export class PaymentService {

  constructor(private sessionCache: SessionCache) { }

  public get amountOptions$(): Observable<UserPaymentAmount[]> {
    return this.invoiceSummary$
      .map(invoiceSummary => UserPaymentAmountType.values.reduce((list, type) => {
        let value = _.get(invoiceSummary.details, type, 0);
        if (type === UserPaymentAmountType.OtherAmount || value > 0) {
          list.push({ type, value });
        }
        return list;
      }, []));
  }

  public get bankAccounts$(): Observable<BankAccount[]> {
    return this.sessionCache.getField$(Session.Field.BankAccounts);
  }

  public get currentBalance$(): Observable<number> {
    return this.invoiceSummary$.map(invoiceSummary => invoiceSummary.details.currentBalance);
  }

  public get invoiceSummary$(): Observable<InvoiceSummary> {
    return this.sessionCache.getField$(Session.Field.InvoiceSummary);
  }

  public get paymentDueDate$(): Observable<string> {
    return this.invoiceSummary$.map(invoiceSummary => invoiceSummary.details.paymentDueDate);
  }

  public get minimumPaymentDue$(): Observable<number> {
    return this.invoiceSummary$.map(invoiceSummary => invoiceSummary.details.minimumPaymentDue);
  }

  public get hasMinimumPaymentDue$(): Observable<boolean> {
    return this.minimumPaymentDue$.map(Boolean);
  }

  public get defaultAmount$(): Observable<UserPaymentAmount> {
    return this.hasMinimumPaymentDue$
      .map(hasMinimumPaymentDue => hasMinimumPaymentDue ? UserPaymentAmountType.MinimumPaymentDue : UserPaymentAmountType.CurrentBalance)
      .flatMap(type => this.amountOptions$.take(1).map(amountOptions => _.first(_.filter(amountOptions, { type }))));
  }

  public get defaultBankAccount$(): Observable<BankAccount> {
    return this.bankAccounts$.map(bankAccounts => _.first(bankAccounts));
  }

  public resolvePaymentAmountType$(amount: number): Observable<UserPaymentAmountType> {
    return Observable.zip(this.minimumPaymentDue$, this.currentBalance$)
      .take(1)
      .map((amounts: [number, number]) => {
        let [minimumPaymentDue, currentBalance] = amounts;

        switch (amount) {
          case minimumPaymentDue: return UserPaymentAmountType.MinimumPaymentDue;
          case currentBalance: return UserPaymentAmountType.CurrentBalance;
          default: return UserPaymentAmountType.OtherAmount;
        }
      });
  }
}
