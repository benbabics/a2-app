import { BankAccount } from "@angular-wex/models";

export type UserPaymentAmountType = keyof {
  minimumPaymentDue,
  currentBalance,
  otherAmount
};

export namespace UserPaymentAmountType {

  export const MinimumPaymentDue: UserPaymentAmountType = "minimumPaymentDue";
  export const CurrentBalance: UserPaymentAmountType = "currentBalance";
  export const OtherAmount: UserPaymentAmountType = "otherAmount";

  export const values: UserPaymentAmountType[] = [MinimumPaymentDue, CurrentBalance, OtherAmount];
}

export interface UserPaymentAmount {
  type: UserPaymentAmountType;
  value: number;
}

export interface UserPayment {

  amount: UserPaymentAmount;
  date: string;
  bankAccount: BankAccount;
  id?: string;
}
