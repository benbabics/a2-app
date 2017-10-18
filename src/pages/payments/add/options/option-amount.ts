import { Component, Input } from "@angular/core";
import { PaymentAmount } from './../../../../providers/payment-service';

@Component({
  selector: "option-amount",
  templateUrl: "option-amount.html"
})
export class OptionAmount {
  @Input() option: PaymentAmount;
}
