import { RadioButton } from "ionic-angular";
import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../../models";
import { Value } from "../../../../decorators/value";

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount implements OnInit {

  @Input() option: UserPaymentAmount;
  @ViewChild("radio") radio: RadioButton;
  @Value("PAGES.PAYMENTS.ADD.LABELS") public readonly LABELS: any;

  public otherAmount: number;

  ngOnInit() {
    if (this.isOtherAmountOption) {
      this.otherAmount = this.option.value;
    }
  }

  public get isOtherAmountOption(): boolean {
    return this.option.type === UserPaymentAmountType.OtherAmount;
  }

  public get label(): string {
    return this.LABELS[this.option.type];
  }

  public get isSelected(): boolean {
    return this.radio ? this.radio.checked : false;
  }
}
