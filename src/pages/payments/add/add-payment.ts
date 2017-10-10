import * as _ from "lodash";
import * as moment from "moment";
import * as accounting from "accounting-js";
import { Component, ViewChild, Injector } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
  TextInput,
  DateTime,
  Keyboard,
  Select
} from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { Session, UserPayment } from "../../../models";
import { InvoiceSummary, BankAccount, Payment } from "@angular-wex/models";
import { WexValidateCurrencyParams } from "@angular-wex/validators";
import { NgForm } from "@angular/forms";
// import { AddPaymentSummaryPage } from "./summary/add-payment-summary";

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}


export type AddPaymentFlowSectionType = keyof {
  Amount,
  Date,
  BankAccount
};

export namespace AddPaymentFlowSectionType {
  export const Amount: AddPaymentFlowSectionType = "Amount";
  export const Date: AddPaymentFlowSectionType = "Date";
  export const BankAccount: AddPaymentFlowSectionType = "BankAccount";
}

export type FormInputTypes = TextInput | DateTime | Select;


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  private static readonly MAX_FUTURE_DAYS = 180;

  @ViewChild("form") flowForm: NgForm;
  @ViewChild("flowFormInput") flowFormInput: FormInputTypes;

  private _paymentAmount: number;

  public paymentDate: string;
  public paymentBankAccount: BankAccount;
  public readonly minPaymentDate = moment().toISOString();
  public readonly maxPaymentDate = moment().add(AddPaymentPage.MAX_FUTURE_DAYS, "days").toISOString();
  public readonly paymentDueDate = this.invoiceSummary.details.paymentDueDate;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewController: ViewController,
    public keyboard: Keyboard
  ) {
    super("Payments.Add", injector, [
      Session.Field.InvoiceSummary,
      Session.Field.BankAccounts
    ]);
  }

  private flowComplete() /*: Promise<any>*/ {
    let userPayment: UserPayment = {
      date: this.paymentDate,
      amount: this._paymentAmount,
      bankAccount: this.paymentBankAccount
    };
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      userPayment.id = existingPayment.details.id;
    }

    /*
    return this.activeFlowSection.onLeave()
      .then(() => this.navCtrl.push(AddPaymentSummaryPage, { userPayment }));
    */
  }

  public get bankAccounts(): BankAccount[] {
    return this.session.bankAccounts || [];
  }

  public get hasMultipleBankAccounts(): boolean {
    return this.bankAccounts.length > 1;
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

  public get validateCurrencyOptions(): WexValidateCurrencyParams {
    return {
      minimumAmount: this.invoiceSummary.details.minimumPaymentDue,
      maximumAmount: this.invoiceSummary.details.currentBalance
    };
  }

  public get hasMinimumPaymentDue(): boolean {
    return !!this.invoiceSummary.details.minimumPaymentDue;
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public compareBankAccounts(a: BankAccount, b: BankAccount): boolean {
    return a && b && a.details.id === b.details.id;
  }

  ionViewDidEnter() {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      this._paymentAmount = existingPayment.details.amount;
      this.paymentDate = existingPayment.details.scheduledDate;
      this.paymentBankAccount = existingPayment.bankAccount;
    }
    else {
      this.paymentDate = moment().toISOString();
      this.paymentBankAccount = _.first(this.bankAccounts);

      let paymentAmountDetail = this.hasMinimumPaymentDue ? "minimumPaymentDue" : "currentBalance";
      this._paymentAmount = this.invoiceSummary.details[paymentAmountDetail];
    }


    let foo = false;
    if (foo) this.flowComplete();
  }
}
