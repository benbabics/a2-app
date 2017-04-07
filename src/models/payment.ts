import { Model } from "./model";
import { PaymentStatus } from "./payment-status";
import { BankAccount } from "./bank-account";

export class PaymentDetails {
  id: string;
  scheduledDate: string;
  amount: number;
  bankAccount: BankAccount.Details;
  status: PaymentStatus;
  confirmationNumber: string;
  method: string;
}

export class Payment extends Model<PaymentDetails> {

    public get bankAccount(): BankAccount {
      return new BankAccount(this.details.bankAccount);
    }
}

export namespace Payment {
    export type Details = PaymentDetails;
    export type Field = keyof Details;
}
