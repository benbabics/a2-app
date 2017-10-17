import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController /*, ViewController*/ } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { PaymentService, PaymentAmount } from './../../../../providers/payment-service';

export type AddPaymentSelectionNavParams = keyof {
  selectedItem: string,
  onSelection: Function
};

export namespace AddPaymentSelectionNavParams {
  export const SelectedItem: AddPaymentSelectionNavParams = "selectedItem";
  export const OnSelection: AddPaymentSelectionNavParams = "onSelection";
}

@Component({
  selector: "page-select-amount",
  templateUrl: "select-amount.html"
})
export class SelectAmountPage extends SecurePage {
  private onSelection: Function;
  private selectedItem: PaymentAmount;
  private options: PaymentAmount[];

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams,
    private paymentService: PaymentService
  ) {
    super("Payments.UpdateAmount", injector);

    this.options = this.paymentService.amountOptions;

    let selectedItem = this.navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.selectedItem = _.first(_.filter(this.options, {key: selectedItem.key}));

    this.onSelection = this.navParams.get(AddPaymentSelectionNavParams.OnSelection);
  }

  public handleSubmit() {
    this.onSelection(this.selectedItem).then(() => this.navCtrl.pop());
  }
}
