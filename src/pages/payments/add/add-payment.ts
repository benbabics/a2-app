import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { BankAccount, Payment } from "@angular-wex/models";
import { PaymentService, PaymentSelectionOption } from "./../../../providers/payment-service";
import { AddPaymentSelectionPage } from "./add-payment-selection";
import { UserPayment } from "../../../models";
import { Value } from "../../../decorators/value";

export type AddPaymentNavParams = keyof {
  payment
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

  @Value("PAGES.PAYMENTS.ADD.LABELS") private readonly LABELS: any;  

  public readonly DATE_FORMAT: string = "MMMM D";

  public payment: UserPayment = {} as UserPayment;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewController: ViewController,
    private paymentService: PaymentService
  ) {
    super("Payments.Add", injector);
  }

  public get isEditingPayment(): boolean {
    return !!this.navParams.get(AddPaymentNavParams.Payment);
  }

  public get paymentBankAccount(): BankAccount {
    return this.payment.bankAccount;
  }

  public get paymentDate(): string {
    return this.payment.date;
  }

  public get paymentDueDate(): string {
    return this.paymentService.paymentDueDate;
  }

  public get paymentLabel(): string {
    return this.LABELS[this.payment.amount.type];
  }

  public get displayAmountWarning(): boolean {
    return this.payment.amount.value < this.paymentService.minimumPaymentDue;
  }

  public get displayDueDateWarning(): boolean {
    return false;
  }

  public get hasMinimumPaymentDue(): boolean {
    return this.paymentService.hasMinimumPaymentDue;
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public updateAmount() {
    let options = this.paymentService.amountOptions,
        selectedItem = _.first(_.filter(options, { type: this.payment.amount.type }));

    this.navigateToSelectionPage("amount", options, selectedItem);
  }

  public updateBankAccount() {
    let options = this.paymentService.bankAccounts,
        selectedItem = this.payment.bankAccount;

    this.navigateToSelectionPage("bankAccount", options, selectedItem);
  }

  private navigateToSelectionPage(selectionType: keyof UserPayment, options: PaymentSelectionOption[], selectedItem: PaymentSelectionOption) {
    let onSelection = (selectedItem: PaymentSelectionOption) => this.payment[selectionType] = selectedItem;

    this.navCtrl.push(AddPaymentSelectionPage, { selectionType, options, selectedItem, onSelection });
  }

  private populatePayment(): void {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      this.payment.amount = {
        type: this.paymentService.resolvePaymentAmountType(existingPayment.details.amount),
        value: existingPayment.details.amount
      };
      this.payment.date = existingPayment.details.scheduledDate;
      this.payment.bankAccount = existingPayment.bankAccount;
      this.payment.id = existingPayment.details.id;
    }
    else {
      this.payment.amount = this.paymentService.defaultAmount;
      this.payment.date = moment().toISOString();
      this.payment.bankAccount = this.paymentService.defaultBankAccount;
    }
  }

  ionViewDidEnter() {
    if (_.isEmpty(this.payment)) {
      this.populatePayment();
    }
  }
}
