import { Model } from "./model";

interface BankAccountDetails {
  id: string;
  defaultBank: boolean;
  lastFourDigits: string;
  name: string;
}

export class BankAccount extends Model<BankAccountDetails> {

    public get displayName(): string {
      if (this.details.name) {
        return `${this.details.name} ${this.details.lastFourDigits}`;
      }

      return this.details.lastFourDigits;
    }
}

export namespace BankAccount {
    export type Details = BankAccountDetails;
    export type Field = keyof Details;
}
