import { Component } from "@angular/core";
import {
  NavParams,
  NavController
} from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { SessionManager, NavBarController } from "../../../../providers";
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

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams,
    public navBarCtrl: NavBarController
  ) {
    super("Payments.Add.Confirmation", sessionManager);

    this.payment = this.navParams.get(AddPaymentConfirmationNavParams.Payment);
  }

  public finish(data?: any) {
    this.navCtrl.setRoot(WexNavBar)
      .then(() => this.navBarCtrl.select(PaymentsPage));
  }
}
