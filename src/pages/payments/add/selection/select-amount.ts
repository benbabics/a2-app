import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams /*, NavController, ViewController*/ } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { PaymentService, PaymentAmount } from './../../../../providers/payment-service';

export type AddPaymentSelectionNavParams = keyof {
  selectedItem: string
};

export namespace AddPaymentSelectionNavParams {
  export const SelectedItem: AddPaymentSelectionNavParams = "selectedItem";
}

@Component({
  selector: "page-select-amount",
  templateUrl: "select-amount.html"
})
export class SelectAmountPage extends SecurePage {
  private selectedItem: PaymentAmount;
  private paymentOptions: PaymentAmount[];

  constructor(
    injector: Injector,
    public navParams: NavParams,
    private paymentService: PaymentService
  ) {
    super("Payments.UpdateAmount", injector);

    this.paymentOptions = this.paymentService.paymentOptions;

    let selectedItem = this.navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.selectedItem = _.first(_.filter(this.paymentOptions, {key: selectedItem.key}));
  }
}
