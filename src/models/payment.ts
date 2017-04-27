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

    public get isComplete(): boolean {
      return this.details.status === PaymentStatus.COMPLETE;
    }

    public get isScheduled(): boolean {
      return this.details.status === PaymentStatus.SCHEDULED;
    }
}

export namespace Payment {
    export type Details = PaymentDetails;
    export type Field = keyof Details;
}
