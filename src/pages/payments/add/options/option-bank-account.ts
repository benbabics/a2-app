import { Component, Input } from "@angular/core";
import { BankAccount } from '@angular-wex/models';

@Component({
  selector: "option-bank-account",
  templateUrl: "option-bank-account.html"
})
export class OptionBankAccount {
  @Input() option: BankAccount;
}
