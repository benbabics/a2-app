// import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { SecurePage } from "../../secure-page";
// import { Session } from "../../../models";
import { /*InvoiceSummary,*/ BankAccount, Payment } from "@angular-wex/models";
import { PaymentService, PaymentAmount } from './../../../providers/payment-service';
import { SelectAmountPage } from "./selection/select-amount";

export type AddPaymentNavParams = keyof {
  payment?: Payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

interface PaymentBuffer {
  amount: PaymentAmount;
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

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }

  public updateAmount() {
    this.navCtrl.push(SelectAmountPage, { selectedItem: this.payment.amount });
  }

  ionViewDidEnter() {
    let existingPayment: Payment = this.navParams.get(AddPaymentNavParams.Payment);

    if (existingPayment) {
      // this.payment.amount = existingPayment.details.amount;
      this.payment.date = existingPayment.details.scheduledDate;
      this.payment.bankAccount = existingPayment.bankAccount;
    }
    else {
      this.payment.amount = this.payment.amount || this.paymentService.defaultPaymentOption;
      this.payment.date = this.payment.date || moment().toISOString();
      this.payment.bankAccount = this.payment.bankAccount || this.paymentService.defaultBankAccount;
    }
  }
}
