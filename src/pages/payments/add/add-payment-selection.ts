import { Component, Injector } from "@angular/core";
import { NavParams, NavController /*, ViewController*/ } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentAmount } from "./../../../providers/payment-service";
import { BankAccount } from "@angular-wex/models";

export type SelectableOption = PaymentAmount | BankAccount;

export type AddPaymentSelectionNavParams = keyof {
  selectionType: String,
  options: SelectableOption[],
  selectedItem: SelectableOption,
  onSelection: Function
};

export namespace AddPaymentSelectionNavParams {
  export const SelectionType: AddPaymentSelectionNavParams = "selectionType";
  export const Options: AddPaymentSelectionNavParams = "options";
  export const SelectedItem: AddPaymentSelectionNavParams = "selectedItem";
  export const OnSelection: AddPaymentSelectionNavParams = "onSelection";
}

@Component({
  selector: "page-add-payment-selection",
  templateUrl: "add-payment-selection.html"
})
export class AddPaymentSelectionPage extends SecurePage {
  public selectionType: string;
  private onSelection: Function;
  public selectedItem: SelectableOption;
  public options: SelectableOption[];

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Payments.Add.Selection", injector);

    this.selectionType = this.navParams.get(AddPaymentSelectionNavParams.SelectionType);
    this.options = this.navParams.get(AddPaymentSelectionNavParams.Options);
    this.selectedItem = this.navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.onSelection = this.navParams.get(AddPaymentSelectionNavParams.OnSelection);
  }

  public get pageTitle(): string {
    return this.CONSTANTS.LABELS[this.selectionType];
  }

  public handleSubmit() {
    this.onSelection(this.selectedItem).then(() => this.navCtrl.pop());
  }
}
