import * as _ from "lodash";
import * as accounting from "accounting-js";
import { TextInput } from "ionic-angular";
import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../../models";
import { Value } from "../../../../decorators/value";

type FormInputTypes = TextInput;

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount implements OnInit {

  @Input() option: UserPaymentAmount;
  @ViewChild("otherAmountInput") otherAmountInput: FormInputTypes;
  @Value("PAGES.PAYMENTS.ADD.LABELS") public readonly LABELS: any;

  private _otherAmount: number;

  ngOnInit() {
    this._otherAmount = this.option.value;
  }

  public get isOtherAmountOption(): boolean {
    return this.option.type === UserPaymentAmountType.OtherAmount;
  }

  public get label(): string {
    return this.LABELS[this.option.type];
  }

  public get otherAmount(): string {
    if (_.isNumber(this._otherAmount)) {
      if (this.otherAmountInput && this.otherAmountInput._isFocus ) {
        return accounting.unformat(this._otherAmount);
      }
      else {
        return accounting.format(this._otherAmount);
      }
    }

    return "";
  }

  public set otherAmount(amount: string) {
    this._otherAmount = accounting.unformat(amount);
  }
}
