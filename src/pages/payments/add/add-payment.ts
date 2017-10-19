import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector, ViewChild } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { BankAccount, Payment } from "@angular-wex/models";
import { PaymentService, PaymentAmount } from './../../../providers/payment-service';
import { AddPaymentSelectionPage, SelectableOption } from "./add-payment-selection";
import { Calendar } from "../../../components/calendar/calendar";

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

// Todo: UserPayment interface
interface PaymentBuffer {
  amount: PaymentAmount;
  date: Date;
  bankAccount: BankAccount;
};


//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {
  @ViewChild("calendar") public calendar: Calendar;

  public payment: PaymentBuffer = <PaymentBuffer>{};
  public minPaymentDate: Date = new Date();
  public maxPaymentDate: Date = moment().add(moment.duration(180, "days")).toDate();

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewController: ViewController,
    public paymentService: PaymentService
  ) {
    super("Payments.Add", injector);
  }

  public get isEditingPayment(): boolean {
    return !!this.navParams.get(AddPaymentNavParams.Payment);
  }

  public get paymentBankAccount(): BankAccount {
    return this.payment.bankAccount;
  }

  public get paymentDate(): Date {
    return this.payment.date;
  }

  public get paymentDueDate(): Date {
    return moment(this.paymentService.paymentDueDate).toDate();
  }

  public get displayAmountWarning(): boolean {
    return this.payment.amount.value < this.paymentService.minimumPaymentDue;
  }

  public get displayDueDateWarning(): boolean {
    return moment(this.paymentDueDate).toDate() < this.paymentDate && this.paymentService.hasMinimumPaymentDue;
  }

  public get hasMinimumPaymentDue(): boolean {
    return this.paymentService.hasMinimumPaymentDue;
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public updateAmount() {
    let options = this.paymentService.amountOptions,
        selectedItem = _.first(_.filter(options, {key: this.payment.amount.key}));

    this.navigateToSelectionPage("amount", options, selectedItem);
  }

  public updateDate() {
    this.calendar.displayCalendar();
  }

  public updateBankAccount() {
    let options = this.paymentService.bankAccounts,
        selectedItem = this.payment.bankAccount;

    this.navigateToSelectionPage("bankAccount", options, selectedItem);
  }

  private navigateToSelectionPage(selectionType: keyof PaymentBuffer, options: SelectableOption[], selectedItem: SelectableOption) {
    let onSelection = (selectedItem: SelectableOption) => new Promise(resolve => {
      this.payment[selectionType] = selectedItem;
      resolve();
    });

    this.navCtrl.push(AddPaymentSelectionPage, { selectionType, options, selectedItem, onSelection });
  }

  private populatePayment(): void {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      // this.payment.amount = existingPayment.details.amount;
      this.payment.date = moment(existingPayment.details.scheduledDate).toDate();
      this.payment.bankAccount = existingPayment.bankAccount;
    }
    else {
      this.payment.amount = this.paymentService.defaultAmount;
      this.payment.date = moment().toDate();
      this.payment.bankAccount = this.paymentService.defaultBankAccount;
    }
  }

  ionViewDidEnter() {
    if (_.isEmpty(this.payment)) {
      this.populatePayment();
    }
  }
}
