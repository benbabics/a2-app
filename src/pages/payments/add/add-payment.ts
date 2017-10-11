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

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

interface PaymentBuffer {
  amount: number;
  date: string;
  bankAccount: BankAccount;
};


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  private paymentBuffer: PaymentBuffer = <PaymentBuffer>{};

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

  public get paymentAmount(): string {
    if (_.isNumber(this.paymentBuffer.amount)) {
      return accounting.format(this.paymentBuffer.amount);
    }

    return "";
  }

  public get paymentBankAccount(): BankAccount {
    return this.paymentBuffer.bankAccount;
  }

  public get paymentDate(): string {
    return this.paymentBuffer.date;
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

  ionViewDidEnter() {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      this.paymentBuffer.amount = existingPayment.details.amount;
      this.paymentBuffer.date = existingPayment.details.scheduledDate;
      this.paymentBuffer.bankAccount = existingPayment.bankAccount;
    }
    else {
      let paymentAmountDetail = this.hasMinimumPaymentDue ? "minimumPaymentDue" : "currentBalance";
      this.paymentBuffer.amount = this.invoiceSummary.details[paymentAmountDetail];
      this.paymentBuffer.date = moment().toISOString();
      this.paymentBuffer.bankAccount = _.first(this.bankAccounts);
    }
  }
}
