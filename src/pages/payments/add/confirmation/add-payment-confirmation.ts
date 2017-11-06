import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController,
  App
} from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { NavBarController } from "../../../../providers";
import { Payment } from "@angular-wex/models";
import { PaymentsPage } from "../../payments";
import { WexNavBar } from "../../../../components";

export type AddPaymentConfirmationNavParams = keyof {
  payment: Payment
};

export namespace AddPaymentConfirmationNavParams {
  export const Payment: AddPaymentConfirmationNavParams = "payment";
}

@Component({
  selector: "page-add-payment-confirmation",
  templateUrl: "add-payment-confirmation.html"
})
export class AddPaymentConfirmationPage extends SecurePage {

  public payment: Payment;
  public readonly DATE_FORMAT: string = "MMMM D, YYYY";

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    public navBarCtrl: NavBarController,
    private app: App
  ) {
    super({ pageName: "Payments.Add.Confirmation", trackView: false }, injector);

    this.payment = this.navParams.get(AddPaymentConfirmationNavParams.Payment);
  }

  public finish() {
    let firstViewCtrl = this.navCtrl.first();

    this.app.getRootNav().setRoot(WexNavBar)
      .then(() => this.navBarCtrl.select(PaymentsPage))
      .then(() => this.navCtrl.remove(firstViewCtrl.index, this.navCtrl.length()))
      .then(() => firstViewCtrl.dismiss());

    this.trackAnalyticsEvent("confirmationOk");
  }
}
