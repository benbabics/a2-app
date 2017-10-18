import * as _ from "lodash";
import * as accounting from "accounting-js";
import { TextInput } from 'ionic-angular';
import { Component, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { PaymentAmount, PaymentAmountTypes } from './../../../../providers/payment-service';

type FormInputTypes = TextInput;

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount implements OnChanges {

  @Input() option: PaymentAmount;
  @ViewChild("otherAmountInput") otherAmountInput: FormInputTypes;

  private _otherAmount: number;
  private keyOtherAmount = PaymentAmountTypes.OtherAmount;

  // ಠ_ಠ this is dumb! no lifecycle hooks for inner-components?!
  ngOnChanges(changes: SimpleChanges) {
    if (changes.option && changes.option.currentValue) {
      this._otherAmount = changes.option.currentValue.value;
    }
  }

  public get isOtherAmountOption(): boolean {
    return this.option.key === this.keyOtherAmount;
  }

  public get otherAmount(): string {
    if (_.isNumber(this._otherAmount)) {
      if (this.otherAmountInput && this.otherAmountInput._isFocus ) {
        return accounting.unformat(this._otherAmount);
      }
      else return accounting.format(this._otherAmount);
    }

    return "";
  }

  public set otherAmount(amount: string) {
    this._otherAmount = accounting.unformat(amount);
  }
}
