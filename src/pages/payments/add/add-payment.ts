import * as _ from "lodash";
import * as moment from "moment";
import * as accounting from "accounting-js";
import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { Session } from "../../../models";
import { InvoiceSummary, BankAccount, Payment } from "@angular-wex/models";
import { UpdateAmountPage } from "./update/amount/update-amount";

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

export type PaymentAmountTypes = keyof {
  minimumPaymentDue: string,
  currentBalance: string
};

export namespace PaymentAmountTypes {
  export const MinimumPaymentDue: PaymentAmountTypes = "minimumPaymentDue";
  export const CurrentBalance: PaymentAmountTypes = "currentBalance";
}

interface PaymentAmountBuffer {
  key: string;
  value: number | string;
  label: string;
}

interface PaymentBuffer {
  amount: PaymentAmountBuffer;
  date: string;
  bankAccount: BankAccount;
};


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  private payment: PaymentBuffer = <PaymentBuffer>{};

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewController: ViewController
  ) {
    super("Payments.Add", injector, [
      Session.Field.InvoiceSummary,
      Session.Field.BankAccounts
    ]);
  }

  public get bankAccounts(): BankAccount[] {
    return this.session.bankAccounts || [];
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  public get isEditingPayment(): boolean {
    return !!this.navParams.get(AddPaymentNavParams.Payment);
  }

  public get invoiceSummaryPayments() {
    let payments: any = _.pick(this.invoiceSummary.details, PaymentAmountTypes.MinimumPaymentDue, PaymentAmountTypes.CurrentBalance);
    return _.map(payments, (value: string, key: string) => {
      return <PaymentAmountBuffer>{ key, value, label: this.CONSTANTS.LABELS[key] };
    });
  }

  public get paymentAmount(): string {
    return accounting.format(this.payment.amount);
  }

  public get paymentBankAccount(): BankAccount {
    return this.payment.bankAccount;
  }

  public get paymentDate(): string {
    return this.payment.date;
  }

  public get paymentDueDate(): string {
    return this.invoiceSummary.details.paymentDueDate;
  }

  public get hasMinimumPaymentDue(): boolean {
    return !!this.invoiceSummary.details.minimumPaymentDue;
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public updateAmount() {
    this.navCtrl.push(UpdateAmountPage, { payment: this.payment });
  }

  ionViewDidEnter() {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      // this.payment.amount = existingPayment.details.amount;
      this.payment.date = existingPayment.details.scheduledDate;
      this.payment.bankAccount = existingPayment.bankAccount;
    }
    else {
      let key = this.hasMinimumPaymentDue ? PaymentAmountTypes.MinimumPaymentDue : PaymentAmountTypes.CurrentBalance;
      this.payment.amount = this.payment.amount || _.first(_.filter(this.invoiceSummaryPayments, {key}));
      this.payment.date = this.payment.date || moment().toISOString();
      this.payment.bankAccount = this.payment.bankAccount || _.first(this.bankAccounts);
    }
  }
}
