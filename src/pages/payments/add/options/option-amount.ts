import { RadioButton } from "ionic-angular";
import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { PaymentAmount, PaymentAmountTypes } from "./../../../../providers/payment-service";

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount implements OnInit {

  @Input() option: PaymentAmount;
  @ViewChild("radio") radio: RadioButton;

  public otherAmount: number;
  public keyOtherAmount = PaymentAmountTypes.OtherAmount;

  ngOnInit() {
    if (this.isOtherAmountOption) {
      this.otherAmount = this.option.value;
    }
  }

  public get isSelected(): boolean {
    return this.radio ? this.radio.checked : false;
  }

  public get isOtherAmountOption(): boolean {
    return this.option.key === this.keyOtherAmount;
  }
}
