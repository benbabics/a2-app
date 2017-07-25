import { App } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SessionManager } from '../../../providers/session-manager';
import { Component } from '@angular/core';
import { DetailsPage } from "../../details-page";
import { Payment } from '@angular-wex/models';

export type PaymentsDetailsNavParams = keyof {
  payment
}

export namespace PaymentsDetailsNavParams {
  export const Payment: PaymentsDetailsNavParams = "payment";
}

@Component({
  selector: "page-payments-details",
  templateUrl: "payments-details.html"
})
export class PaymentsDetailsPage extends DetailsPage {

  public payment: Payment;

  constructor(
    sessionManager: SessionManager,
    public navParams: NavParams,
    private app: App
  ) {
    super("Payments.Details", sessionManager);
    this.payment = this.navParams.get(PaymentsDetailsNavParams.Payment);
  }
}
