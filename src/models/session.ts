import {
  User,
  Company,
  Card,
  Payment,
  Driver,
  Transaction,
  MakePaymentAvailability,
  InvoiceSummary,
  BankAccount
} from "@angular-wex/models";
import { DynamicList } from "./dynamic-list";

export type TransactionList = DynamicList<Transaction, Transaction.Details>;

export type Session = Partial<{
    user: User;
    token: string;
    billingCompany: Company;
    userCompany: Company;
    cards: Card[];
    payments: Payment[];
    drivers: Driver[];
    pendingTransactions: Transaction[];
    postedTransactions: Transaction[];
    pendingTransactionsInfo: TransactionList;
    postedTransactionsInfo: TransactionList;
    makePaymentAvailability: MakePaymentAvailability;
    invoiceSummary: InvoiceSummary;
    bankAccounts: BankAccount[];
}>;

export namespace Session {
    export type Field = keyof Session;

    export namespace Field {
      export const BankAccounts: Field = "bankAccounts";
      export const BillingCompany: Field = "billingCompany";
      export const Cards: Field = "cards";
      export const Drivers: Field = "drivers";
      export const InvoiceSummary: Field = "invoiceSummary";
      export const MakePaymentAvailability: Field = "makePaymentAvailability";
      export const Payments: Field = "payments";
      export const PendingTransactions: Field = "pendingTransactions";
      export const PostedTransactions: Field = "postedTransactions";
      export const PendingTransactionsInfo: Field = "pendingTransactionsInfo";
      export const PostedTransactionsInfo: Field = "postedTransactionsInfo";
      export const Token: Field = "token";
      export const User: Field = "user";
      export const UserCompany: Field = "userCompany";

      export const All: Field[] = [
        Token,
        User,
        BillingCompany,
        Cards,
        Drivers,
        InvoiceSummary,
        MakePaymentAvailability,
        Payments,
        //PendingTransactions,
        PostedTransactions,
        PostedTransactionsInfo,
        UserCompany,
        BankAccounts
      ];
    }
}
