// import * as _ from "lodash";
import { AddPaymentNavParams } from './../../add-payment';
import { Component, Injector } from "@angular/core";
import { NavParams /*, NavController, ViewController*/ } from "ionic-angular";
import { SecurePage } from "../../../../secure-page";

@Component({
  selector: "page-update-amount",
  templateUrl: "update-amount.html"
})
export class UpdateAmountPage extends SecurePage {
  private payment /*: PaymentDetailBuffer*/;
  private _buffer: string;

  constructor(
    injector: Injector,
    public navParams: NavParams
  ) {
    super("Payments.UpdateAmount", injector);
  }

  ionViewDidEnter() {
    this.payment = this.navParams.get(AddPaymentNavParams.Payment);
    this._buffer = (this.payment.amount).toString();
  }

  public get buffer(): string {
    /*
    if (_.isNumber(this._buffer)) {
      if (this.activeFlowSection.isFlowInputFocused) {
        return accounting.unformat(this._buffer);
      }
      else {
        return accounting.format(this._buffer);
      }
    }
    */

    return "";
  }
}
