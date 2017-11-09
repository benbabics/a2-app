import * as _ from "lodash";
import { NavParams, NavController, App } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Payment } from "@angular-wex/models";
import { WexPlatform } from "../../../providers";
import { AddPaymentPage } from "../add/add-payment";
import { PaymentProvider } from "@angular-wex/api-providers";
import { WexAlertController } from "../../../components/wex-alert-controller/wex-alert-controller";
import { Session } from "../../../models/session";

export type PaymentsDetailsNavParams = keyof {
  payment,
  multiplePending
};

export namespace PaymentsDetailsNavParams {
  export const Payment: PaymentsDetailsNavParams = "payment";
  export const MultiplePending: PaymentsDetailsNavParams = "multiplePending";
}

@Component({
  selector: "page-payments-details",
  templateUrl: "payments-details.html"
})
export class PaymentsDetailsPage extends DetailsPage {

  public readonly DATE_FORMAT: string = "MMM D, YYYY";

  public payment: Payment;
  public isCanceling: boolean;
  public multiplePending: boolean;

  constructor(
    public navParams: NavParams,
    public platform: WexPlatform,
    public paymentProvider: PaymentProvider,
    public wexAlertController: WexAlertController,
    public navCtrl: NavController,
    public app: App,
    injector: Injector
  ) {
    super("Payments.Details", injector, [Session.Field.Payments]);
    this.payment = this.navParams.get(PaymentsDetailsNavParams.Payment);
  }

  public get headerLabel(): string {
    return this.isScheduled ? this.CONSTANTS.header.scheduled : this.CONSTANTS.header.completed;
  }

  public get isCompleted(): boolean {
    return this.payment.isComplete;
  }

  public get isScheduled(): boolean {
    return this.payment.isScheduled;
  }

  public ionViewCanEnter(): Promise<any> {
    return super.ionViewCanEnter()
      .then(() => {
        this.multiplePending = this.session.payments.filter(payment => payment.isScheduled).length > 1;
      });
  }

  public cancelPayment() {
    this.wexAlertController.confirmation(this.CONSTANTS.cancelPaymentConfirmation, () => {
      this.isCanceling = true;

      this.paymentProvider.cancelPayment(this.session.user.billingCompany.details.accountId, this.payment.details.id)
        .flatMap(() => this.sessionCache.getField$<Payment[]>(Session.Field.Payments))
        .map(payments => this.sessionCache.updateValue(Session.Field.Payments, _.remove(payments, payment => payment.details.id === this.payment.details.id)))
        .map(() => this.isCanceling = false)
        .subscribe(() => this.navCtrl.pop());

      this.trackAnalyticsEvent("paymentCancelYes");
    });

    this.trackAnalyticsEvent("paymentCancelPrompt");
  }

  public editPayment() {
    this.app.getRootNav().push(AddPaymentPage, { payment: this.payment });
    this.trackAnalyticsEvent("paymentEdit");
  }
}
