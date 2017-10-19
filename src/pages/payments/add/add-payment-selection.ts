import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentSelectionOption } from "./../../../providers/payment-service";

export type AddPaymentSelectionNavParams = keyof {
  selectionType
  options
  selectedItem
  onSelection
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
  private onSelection: (selection: PaymentSelectionOption) => void;
  public selectedItem: PaymentSelectionOption;
  public options: PaymentSelectionOption[];

  constructor(
    injector: Injector,
    navParams: NavParams,
    public navCtrl: NavController,
    
  ) {
    super("Payments.Add.Selection", injector);

    this.selectionType = navParams.get(AddPaymentSelectionNavParams.SelectionType);
    this.options = navParams.get(AddPaymentSelectionNavParams.Options);
    this.selectedItem = navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.onSelection = navParams.get(AddPaymentSelectionNavParams.OnSelection);
  }

  public get pageTitle(): string {
    return this.CONSTANTS.LABELS[this.selectionType];
  }

  public handleSubmit() {
    this.onSelection(this.selectedItem);
    this.navCtrl.pop();
  }
}
