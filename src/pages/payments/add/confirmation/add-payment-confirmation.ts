import * as _ from "lodash";
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
import { WexDate, WexCurrency } from "../../../../pipes/index";

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

  private wexDatePipe: WexDate = new WexDate();
  private wexCurrencyPipe: WexCurrency = new WexCurrency();

  public payment: Payment;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    public navBarCtrl: NavBarController,
    private app: App
  ) {
    super("Payments.Add.Confirmation", injector);

    this.payment = this.navParams.get(AddPaymentConfirmationNavParams.Payment);
  }

  public get confirmationMessage(): string {
    return _.template(this.CONSTANTS.MESSAGES.confirmationMessage)({
      paymentAmount: this.wexCurrencyPipe.transform(this.payment.details.amount),
      paymentDate: this.wexDatePipe.transform(this.payment.details.scheduledDate, false),
      bankAccount: this.payment.details.bankAccount.name
    });
  }

  public finish() {
    let firstViewCtrl = this.navCtrl.first();

    this.app.getRootNav().setRoot(WexNavBar)
      .then(() => this.navBarCtrl.select(PaymentsPage))
      .then(() => this.navCtrl.remove(firstViewCtrl.index, this.navCtrl.length()))
      .then(() => firstViewCtrl.dismiss());
  }
}
