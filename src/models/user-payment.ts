import { BankAccount } from "@angular-wex/models";

export interface UserPayment {

  amount: number;
  date: string;
  bankAccount: BankAccount;
}
