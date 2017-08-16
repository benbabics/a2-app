import { NavParams } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Payment } from "@angular-wex/models";

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

  public payment: Payment;

  constructor(
    public navParams: NavParams,
    injector: Injector
  ) {
    super("Payments.Details", injector);
    this.payment = this.navParams.get(PaymentsDetailsNavParams.Payment);
  }
}
