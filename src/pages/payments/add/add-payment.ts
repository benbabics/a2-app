import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector, ViewChild } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { SecurePage } from "../../secure-page";
import { Session } from "../../../models/session";
import { BankAccount, Payment } from "@angular-wex/models";
import { PaymentProvider, PaymentRequest } from "@angular-wex/api-providers";
import { PaymentService, PaymentAmount } from "./../../../providers/payment-service";
import { AddPaymentSelectionPage, SelectableOption } from "./add-payment-selection";
import { Calendar } from "../../../components/calendar/calendar";
import { AddPaymentConfirmationPage } from "./confirmation/add-payment-confirmation";

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

// Todo: UserPayment interface
interface PaymentBuffer {
  id?: string;
  amount: PaymentAmount;
  date: Date;
  bankAccount: BankAccount;
}


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
  public isLoading: boolean = false;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewController: ViewController,
    public paymentService: PaymentService,
    private paymentProvider: PaymentProvider
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
    console.log(moment(this.paymentDueDate).toDate());
    console.log(this.paymentDate);
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

  public handleSchedulePayment() {
    let paymentRequest: PaymentRequest = {
      amount: this.payment.amount.value,
      scheduledDate: this.payment.date,
      bankAccountId: this.payment.bankAccount.details.id
    };

    this.schedulePayment(paymentRequest);
  }

  private navigateToSelectionPage(selectionType: keyof PaymentBuffer, options: SelectableOption[], selectedItem: SelectableOption) {
    let onSelection = (selectedItem: SelectableOption) => new Promise(resolve => {
      this.payment[selectionType] = selectedItem;
      resolve();
    });

    this.navCtrl.push(AddPaymentSelectionPage, { selectionType, options, selectedItem, onSelection });
  }

  private schedulePayment(paymentRequest: PaymentRequest) {
    this.isLoading = true;

    let accountId: string = this.session.user.billingCompany.details.accountId;
    let paymentState: Observable<Payment>;

    if (this.isEditingPayment) {
      paymentState = this.paymentProvider.editPayment(accountId, this.payment.id, paymentRequest);
    }
    else {
      paymentState = this.paymentProvider.addPayment(accountId, paymentRequest);
    }

    paymentState
      .finally(() => this.isLoading = false)
      .subscribe((payment) => {
        // Update the cache
        this.sessionCache.requestSessionDetail(Session.Field.Payments);
        this.navCtrl.setRoot(AddPaymentConfirmationPage, { payment });
      }, (error) => {
        /* TODO - What do we do here? */
        console.error(error);
      });
  }

  private populatePayment(): void {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      this.payment.id = existingPayment.details.id;
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
