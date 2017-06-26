import * as _ from "lodash";
import { Component } from "@angular/core";
import { NavParams, NavController, ViewController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { SessionManager } from "../../../providers";
import { PaymentProvider } from "@angular-wex/api-providers";
import { Session } from "../../../models";
import { InvoiceSummary } from "@angular-wex/models";

@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams,
    private paymentProvider: PaymentProvider,
    private viewController: ViewController
  ) {
    super("Payments.Add", sessionManager, [
      Session.Field.InvoiceSummary
    ]);
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }
}
