import { Component, Injector } from "@angular/core";
import {
  NavParams,
  NavController
} from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { NavBarController } from "../../../../providers";
import { Payment } from "@angular-wex/models";
import * as _ from "lodash";

export type AddPaymentConfirmationNavParams = keyof {
  payment: Payment,
  confirmationType: boolean
};

export namespace AddPaymentConfirmationNavParams {
  export const Payment: AddPaymentConfirmationNavParams = "payment";
  export const IsEditingPayment = "isEditingPayment";
}

@Component({
  selector: "page-add-payment-confirmation",
  templateUrl: "add-payment-confirmation.html"
})
export class AddPaymentConfirmationPage extends SecurePage {

  public payment: Payment;
  public readonly DATE_FORMAT: string = "MMMM D, YYYY";
  public isEditingPayment: boolean;
  public pageTitle: string;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    public navBarCtrl: NavBarController
  ) {
    super({ pageName: "Payments.Add.Confirmation", trackView: false }, injector);

    this.payment = this.navParams.get(AddPaymentConfirmationNavParams.Payment);
    this.isEditingPayment = this.navParams.get(AddPaymentConfirmationNavParams.IsEditingPayment);

    this.pageTitle = this.buildTitle();
  }

  public finish() {
    this.navCtrl.pop({ direction: "forward" });
    this.trackAnalyticsEvent("confirmationOk");
  }

  private buildTitle(): string {
    let scheduledOrUpdated = this.isEditingPayment ? this.CONSTANTS.title.updated : this.CONSTANTS.title.scheduled;
    return _.template(this.CONSTANTS.title.template)({ scheduledOrUpdated });
  }
}
