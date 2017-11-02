import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentSelectionOption } from "./../../../providers/payment-service";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../models/user-payment";
import { WexPlatform } from "../../../providers";

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
  public initialSelection: PaymentSelectionOption;
  public options: PaymentSelectionOption[];

  constructor(
    injector: Injector,
    navParams: NavParams,
    public navCtrl: NavController,
    public platform: WexPlatform
  ) {
    super("Payments.Add.Selection", injector, null, { trackView: false });

    this.selectionType = navParams.get(AddPaymentSelectionNavParams.SelectionType);
    this.options = navParams.get(AddPaymentSelectionNavParams.Options);
    this.selectedItem = navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    this.initialSelection = this.selectedItem;
    this.onSelection = navParams.get(AddPaymentSelectionNavParams.OnSelection);
    if (this.isPaymentAmount) {
      this.otherAmount = (this.options as UserPaymentAmount[])[this.options.length - 1].value;
    }
  }

  public get pageTitle(): string {
    return this.CONSTANTS.LABELS[this.selectionType];
  }

  public otherAmount: number = 0;
  isPaymentAmount(selectedItem: PaymentSelectionOption): selectedItem is UserPaymentAmount {
    return "type" in selectedItem;
  }

  public get isCustomPaymentAmount(): boolean {
    return this.isPaymentAmount(this.selectedItem) && (this.selectedItem as UserPaymentAmount).type === UserPaymentAmountType.OtherAmount;
  }


  public handleSubmit() {
    this.onSelection(this.selectedItem);
    if (this.isCustomPaymentAmount) {
      (this.selectedItem as UserPaymentAmount).value = this.otherAmount;
    }
    this.navCtrl.pop();
  }

  public get disableSubmit(): boolean {
    // If this is a new custom amount, enable the button (as long as the custom amount is not 0).
    if (this.isCustomPaymentAmount) {
      if (this.otherAmount === 0) {
        return true;
      } else if ((this.selectedItem as UserPaymentAmount).value === this.otherAmount) {
        return (this.selectedItem === this.initialSelection);
      }
    }
    // Otherwise, if the selected item is the same, disable the button.
    else if (this.selectedItem === this.initialSelection) {
      return true;
    }
    // Otherwise, the selection must be new, so enable the button.
    return false;
  }
}
