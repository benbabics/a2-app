import * as _ from "lodash";
import * as moment from "moment";
import * as accounting from "accounting-js";
import { Component, ViewChild, trigger, transition, style, animate, Injector } from "@angular/core";
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
import { AddPaymentSummaryPage } from "./summary/add-payment-summary";

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
}

export namespace AddPaymentFlowSectionType {

  export const Amount: AddPaymentFlowSectionType = "Amount";
  export const Date: AddPaymentFlowSectionType = "Date";
  export const BankAccount: AddPaymentFlowSectionType = "BankAccount";
}

export type FormInputTypes = TextInput | DateTime | Select;
export type AddPaymentFlowSectionBase = AddPaymentFlowSection<FormInputTypes>;


//# AddPaymentFlowSection
export abstract class AddPaymentFlowSection<InputT extends FormInputTypes> {

  constructor(
    public readonly type: AddPaymentFlowSectionType,
    protected page: AddPaymentPage,
    protected lastSection?: AddPaymentFlowSectionBase
  ) { }

  protected getFormInput(): InputT {
    return this.page.flowFormInput as InputT;
  }

  public abstract goForward(): AddPaymentFlowSectionBase;

  public get isFlowInputFocused(): boolean {
    return this.page.flowFormInput && this.page.flowFormInput._isFocus;
  }

  public onEnter(): Promise<any> {
    return Promise.resolve();
  }

  public onLeave(): Promise<any> {
    return Promise.resolve();
  }

  public canGoBack(): boolean {
    return !!this.lastSection;
  }

  public canGoForward(): boolean {
    return this.page.flowForm.valid;
  }

  public goBack(): AddPaymentFlowSectionBase {
    return this.lastSection;
  }

  public hasNextSection(): boolean {
    return true;
  }
}


//# AddPaymentFlowAmountSection
export class AddPaymentFlowAmountSection extends AddPaymentFlowSection<TextInput> {

  constructor(page: AddPaymentPage) {
    super(AddPaymentFlowSectionType.Amount, page);
  }

  public canGoBack(): boolean {
    return false;
  }

  public onEnter(): Promise<any> {
    return new Promise((resolve) => setTimeout(() => {
      //Focus the input field
      this.getFormInput().setFocus();
      resolve();
    }, 150));
  }

  public onLeave(): Promise<any> {
    this.page.keyboard.close();
    return Promise.resolve();
  }

  public goForward(): AddPaymentFlowDateSection {
    return new AddPaymentFlowDateSection(this.page, this);
  }
}


//# AddPaymentFlowDateSection
export class AddPaymentFlowDateSection extends AddPaymentFlowSection<DateTime> {

  constructor(page: AddPaymentPage, lastSection?: AddPaymentFlowSectionBase) {
    super(AddPaymentFlowSectionType.Date, page, lastSection);
  }

  public onEnter(): Promise<any> {
    //Open the datepicker
    return new Promise((resolve) => setTimeout(() => {
      this.getFormInput().open();
      resolve();
    }, 0));
  }

  public goForward(): AddPaymentFlowBankAccountSection {
    if (this.page.hasMultipleBankAccounts) {
      return new AddPaymentFlowBankAccountSection(this.page, this);
    }
    else {
      throw new Error("Cannot go forward (end of flow).");
    }
  }

  public hasNextSection(): boolean {
    return this.page.hasMultipleBankAccounts;
  }
}

//# AddPaymentFlowBankAccountSection
export class AddPaymentFlowBankAccountSection extends AddPaymentFlowSection<Select> {

  constructor(page: AddPaymentPage, lastSection?: AddPaymentFlowSectionBase) {
    super(AddPaymentFlowSectionType.BankAccount, page, lastSection);
  }

  public onEnter(): Promise<any> {
    //Open the datepicker
    return new Promise((resolve) => setTimeout(() => {
      this.getFormInput().open();
      resolve();
    }, 0));
  }

  public goForward(): undefined {
    throw new Error("Cannot go forward (end of flow).");
  }

  public hasNextSection(): boolean {
    return false;
  }
}


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html",
  animations: [
    trigger("flowTransition", [
      transition(":enter", [
        style({ transform: "translate3d(100%, 0, 0)" }),
        animate("300ms", style({ transform: "translate3d(0, 0, 0)" }))
      ]),
      transition(":leave", [
        style({ transform: "translate3d(0, 0, 0)" }),
        animate("300ms", style({ transform: "translate3d(-100%, 0, 0)" }))
      ])
    ])
  ]
})
export class AddPaymentPage extends SecurePage {

  private static readonly MAX_FUTURE_DAYS = 180;

  @ViewChild("form") flowForm: NgForm;
  @ViewChild("flowFormInput") flowFormInput: FormInputTypes;

  private _paymentAmount: number;

  public activeFlowSection: AddPaymentFlowSectionBase = new AddPaymentFlowAmountSection(this);
  public paymentDate: string;
  public paymentBankAccount: BankAccount;
  public readonly minPaymentDate = moment().toISOString();
  public readonly maxPaymentDate = moment().add(AddPaymentPage.MAX_FUTURE_DAYS, "days").toISOString();

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

  private flowComplete(): Promise<any> {
    let userPayment: UserPayment = {
      date: this.paymentDate,
      amount: this._paymentAmount,
      bankAccount: this.paymentBankAccount
    };
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      userPayment.id = existingPayment.details.id;
    }

    return this.activeFlowSection.onLeave()
      .then(() => this.navCtrl.push(AddPaymentSummaryPage, { userPayment }));
  }

  private flowBack(): Promise<any> {
    return this.activeFlowSection.onLeave()
      .then(() => this.activeFlowSection = this.activeFlowSection.goBack())
      .then(() => this.activeFlowSection.onEnter());
  }

  private flowForward(): Promise<any> {
    return this.activeFlowSection.onLeave()
      .then(() => this.activeFlowSection = this.activeFlowSection.goForward())
      .then(() => this.activeFlowSection.onEnter());
  }

  public get bankAccounts(): BankAccount[] {
    return this.session.bankAccounts || [];
  }

  public get canFlowBack(): boolean {
    return this.activeFlowSection.canGoBack();
  }

  public get canFlowForward(): boolean {
    return this.activeFlowSection.canGoForward();
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
      if (this.activeFlowSection.isFlowInputFocused) {
        return accounting.unformat(this._paymentAmount);
      }
      else {
        return accounting.format(this._paymentAmount);
      }
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

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public compareBankAccounts(a: BankAccount, b: BankAccount): boolean {
    return a && b && a.details.id === b.details.id;
  }

  public onFlowBack() {
    if (this.canFlowBack) {
      this.flowBack();
    }
  }

  public onFlowForward() {
    if (this.canFlowForward) {
      if (this.activeFlowSection.hasNextSection()) {
        this.flowForward();
      }
      else {
        this.flowComplete();
      }
    }
  }

  ionViewDidEnter() {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      this._paymentAmount = existingPayment.details.amount;
      this.paymentDate = existingPayment.details.scheduledDate;
      this.paymentBankAccount = existingPayment.bankAccount;
    }
    else {
      this._paymentAmount = this.invoiceSummary.details.statementBalance;
      this.paymentDate = moment().toISOString();
      this.paymentBankAccount = _.first(this.bankAccounts);
    }

    this.activeFlowSection.onEnter();
  }
}
