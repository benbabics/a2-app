import { Component, Injector } from "@angular/core";
import { NavParams, NavController /*, ViewController*/ } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentAmount } from './../../../providers/payment-service';
import { BankAccount } from '@angular-wex/models';

export type AddPaymentSelectionNavParams = keyof {
  options: PaymentAmount[] | BankAccount[],
  selectedItem: PaymentAmount | BankAccount,
  onSelection: Function
};

export namespace AddPaymentSelectionNavParams {
  export const Options: AddPaymentSelectionNavParams = "options";
  export const SelectedItem: AddPaymentSelectionNavParams = "selectedItem";
  export const OnSelection: AddPaymentSelectionNavParams = "onSelection";
}

@Component({
  selector: "page-add-payment-selection",
  templateUrl: "add-payment-selection.html"
})
export class AddPaymentSelectionPage extends SecurePage {
  private onSelection: Function;
  private selectedItem: PaymentAmount | BankAccount;
  private options: PaymentAmount[] | BankAccount[];

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Payments.UpdateAmount", injector);

    this.options = this.navParams.get(AddPaymentSelectionNavParams.Options);
    this.selectedItem = this.navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.onSelection = this.navParams.get(AddPaymentSelectionNavParams.OnSelection);
  }

  public handleSubmit() {
    this.onSelection(this.selectedItem).then(() => this.navCtrl.pop());
  }
}
