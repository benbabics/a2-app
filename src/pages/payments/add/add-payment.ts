import * as _ from "lodash";
import * as accounting from "accounting-js";
import { Component } from "@angular/core";
import { NavParams, NavController, ViewController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { SessionManager } from "../../../providers";
import { PaymentProvider } from "@angular-wex/api-providers";
import { Session } from "../../../models";
import { InvoiceSummary } from "@angular-wex/models";
import { WexValidateCurrencyParams } from "@angular-wex/validators";

@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
export class AddPaymentPage extends SecurePage {

  private _paymentAmount: number;
  private focused: boolean = false;

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

  public get paymentAmount(): string {
    if (_.isNumber(this._paymentAmount)) {
      if (this.focused) {
        return accounting.unformat(this._paymentAmount);
      }
      else {
        return accounting.format(this._paymentAmount);
      }
    }

    return "";
  }

  public set paymentAmount(paymentAmount: string) {
    this._paymentAmount = accounting.unformat(paymentAmount);
  }

  public get validateCurrencyOptions(): WexValidateCurrencyParams {
    return {
      minimumAmount: 0,
      maximumAmount: this.invoiceSummary.details.currentBalance
    };
  }

  public cancel(data?: any) {
    this.viewController.dismiss(data);
  }
}
