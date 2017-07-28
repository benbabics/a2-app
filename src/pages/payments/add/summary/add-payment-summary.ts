import { Observable } from 'rxjs';
import * as moment from "moment";
import { Component } from "@angular/core";
import {
  NavParams,
  NavController
} from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { SessionManager } from "../../../../providers";
import { InvoiceSummary, Payment } from "@angular-wex/models";
import { Session, UserPayment } from "../../../../models";
import { AddPaymentConfirmationPage } from "../confirmation/add-payment-confirmation";
import { PaymentProvider, PaymentRequest } from "@angular-wex/api-providers";

export type AddPaymentSummaryNavParams = keyof {
  userPayment: UserPayment
};

export namespace AddPaymentSummaryNavParams {
  export const UserPayment: AddPaymentSummaryNavParams = "userPayment";
}

@Component({
  selector: "page-add-payment-summary",
  templateUrl: "add-payment-summary.html"
})
export class AddPaymentSummaryPage extends SecurePage {

  public userPayment: UserPayment;
  public isLoading: boolean = false;

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams,
    private paymentProvider: PaymentProvider
  ) {
    super("Payments.Add.Summary", sessionManager, [Session.Field.InvoiceSummary]);

    this.userPayment = this.navParams.get(AddPaymentSummaryNavParams.UserPayment);
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  public get isEditingPayment(): boolean {
    return !!this.userPayment.id;
  }

  public get isPaymentAfterDueDate(): boolean {
    return moment(this.userPayment.date).isAfter(this.invoiceSummary.paymentDueDate);
  }

  public confirm() {
    let accountId: string = this.session.user.billingCompany.details.accountId;
    let paymentRequest: PaymentRequest = {
      amount: this.userPayment.amount,
      scheduledDate: this.userPayment.date,
      bankAccountId: this.userPayment.bankAccount.details.id
    };
    let paymentState: Observable<Payment>;

    this.isLoading = true;

    if (this.isEditingPayment) {
      paymentState = this.paymentProvider.editPayment(accountId, this.userPayment.id, paymentRequest);
    }
    else {
      paymentState = this.paymentProvider.addPayment(accountId, paymentRequest);
    }

    paymentState
      .finally(() => this.isLoading = false)
      .subscribe((payment) => {
        // Update the cache
        this.sessionManager.cache.requestSessionDetail(Session.Field.Payments);

        this.navCtrl.setRoot(AddPaymentConfirmationPage, { payment });
      }, (error) => {
        /* TODO - What do we do here? */
        console.error(error);
      });
  }
}
