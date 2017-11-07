import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentSelectionOption } from "./../../../providers/payment-service";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../models/user-payment";
import { WexPlatform } from "../../../providers";
import { BankAccount } from "@angular-wex/models";
import * as _ from "lodash";

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
    super({ pageName: "Payments.Add.Selection", trackView: false }, injector);

    this.selectionType = navParams.get(AddPaymentSelectionNavParams.SelectionType);
    this.options = navParams.get(AddPaymentSelectionNavParams.Options);
    this.selectedItem = navParams.get(AddPaymentSelectionNavParams.SelectedItem);
    if (this.isBankAccount) {
      this.identifyBankAccountFromOptions();
    }
    this.initialSelection = this.selectedItem;
    this.onSelection = navParams.get(AddPaymentSelectionNavParams.OnSelection);
    if (this.isPaymentAmount) {
      this.otherAmount = this.customAmount.value;
    }
  }

  private identifyBankAccountFromOptions() {
    let selectedId = (this.selectedItem as BankAccount).details.id;
    this.selectedItem = _.find((this.options as BankAccount[]), account => account.details.id === selectedId);
  }

  public get pageTitle(): string {
    return this.CONSTANTS.LABELS[this.selectionType];
  }

  public otherAmount: number = 0;
  public get isPaymentAmount(): boolean {
    return !(this.selectedItem instanceof BankAccount);
  }

  public get isBankAccount(): boolean {
    return this.selectedItem instanceof BankAccount;
  }

  public get isCustomPaymentAmount(): boolean {
    return this.isPaymentAmount && (this.selectedItem as UserPaymentAmount).type === UserPaymentAmountType.OtherAmount;
  }

  public get customAmount(): UserPaymentAmount {
    return (this.options as UserPaymentAmount[])[this.options.length - 1];
  }


  public handleSubmit() {
    this.onSelection(this.selectedItem);
    if (this.isCustomPaymentAmount) {
      (this.selectedItem as UserPaymentAmount).value = this.otherAmount;
    } else if (this.isPaymentAmount) {
      this.customAmount.value = 0;
    }
    this.navCtrl.pop();
  }

  public get disableSubmit(): boolean {
    // If this is a new custom amount, enable the button (as long as the custom amount is not 0).
    if (this.isPaymentAmount) {
    if (this.isCustomPaymentAmount) {
      if (this.otherAmount === 0) {
        return true;
      } else if ((this.selectedItem as UserPaymentAmount).value === this.otherAmount) {
        return (this.selectedItem === this.initialSelection);
        }
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
