import { RadioButton } from "ionic-angular";
import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from "@angular/core";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../../models";
import { Value } from "../../../../decorators/value";

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount implements OnInit {

  @Input() option: UserPaymentAmount;
  @Output() otherAmountEmit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild("radio") radio: RadioButton;
  @Value("PAGES.PAYMENTS.ADD.LABELS") public readonly LABELS: any;

  public otherAmount: number;

  ngOnInit() {
    if (this.isOtherAmountOption && !!this.option.value) {
      this.otherAmount = this.option.value;
    } else {
      this.otherAmount = 0;
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
