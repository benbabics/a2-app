import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController
} from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { NavBarController } from "../../../../providers";
import { Payment } from "@angular-wex/models";

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
    public navBarCtrl: NavBarController
  ) {
    super("Payments.Add.Confirmation", injector);

    this.payment = this.navParams.get(AddPaymentConfirmationNavParams.Payment);
  }

  public finish() {
    this.navCtrl.pop({ direction: "forward" });
  }
}
