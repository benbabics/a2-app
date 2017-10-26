import { NavParams, ModalController, NavController } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Payment } from "@angular-wex/models";
import { WexPlatform } from "../../../providers";
import { AddPaymentPage } from "../add/add-payment";
import { PaymentProvider } from "@angular-wex/api-providers";
import { WexAlertController } from "../../../components/wex-alert-controller/wex-alert-controller";

export type PaymentsDetailsNavParams = keyof {
  payment
};

export namespace PaymentsDetailsNavParams {
  export const Payment: PaymentsDetailsNavParams = "payment";
}

@Component({
  selector: "page-payments-details",
  templateUrl: "payments-details.html"
})
export class PaymentsDetailsPage extends DetailsPage {

  public readonly DATE_FORMAT: string = "MMM D, YYYY";

  public payment: Payment;

  constructor(
    public navParams: NavParams,
    public platform: WexPlatform,
    public modalCtrl: ModalController,
    public paymentProvider: PaymentProvider,
    public wexAlertController: WexAlertController,
    public navCtrl: NavController,
    injector: Injector
  ) {
    super("Payments.Details", injector);
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

  public cancelPayment() {
    this.wexAlertController.confirmation(this.CONSTANTS.cancelPaymentConfirmation, () => {
      this.paymentProvider.cancelPayment(this.session.user.billingCompany.details.accountId, this.payment.details.id)
        .subscribe(() => this.navCtrl.pop());

      this.trackAnalyticsEvent("paymentCancelYes");
    });

    this.trackAnalyticsEvent("paymentCancelPrompt");
  }

  public editPayment() {
    this.modalCtrl.create(AddPaymentPage, { payment: this.payment }).present();
    this.trackAnalyticsEvent("paymentEdit");
  }

  ionViewWillEnter() {
    this.trackAnalyticsEvent("paymentDetails");
  }
}
