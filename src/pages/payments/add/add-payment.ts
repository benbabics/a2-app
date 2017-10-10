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


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  private _paymentAmount: number;

  public paymentDueDate: string;
  public paymentDate: string;
  public paymentBankAccount: BankAccount;

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
    if (_.isNumber(this._paymentAmount)) {
      return accounting.format(this._paymentAmount);
    }

    return "";
  }

  public set paymentAmount(paymentAmount: string) {
    this._paymentAmount = accounting.unformat(paymentAmount);
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
      this._paymentAmount = existingPayment.details.amount;
      this.paymentDate = existingPayment.details.scheduledDate;
      this.paymentBankAccount = existingPayment.bankAccount;
    }
    else {
      let paymentAmountDetail = this.hasMinimumPaymentDue ? "minimumPaymentDue" : "currentBalance";
      this._paymentAmount = this.invoiceSummary.details[paymentAmountDetail];

      this.paymentDate = moment().toISOString();
      this.paymentBankAccount = _.first(this.bankAccounts);
    }

    this.paymentDueDate = this.invoiceSummary.details.paymentDueDate;
  }
}
