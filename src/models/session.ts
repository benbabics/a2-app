import {
  User,
  Company,
  Card,
  Payment,
  Driver,
  PostedTransaction,
  MakePaymentAvailability,
  InvoiceSummary,
  BankAccount,
  PendingTransaction
} from "@angular-wex/models";
import { DynamicList } from "./dynamic-list";

export type PostedTransactionList = DynamicList<PostedTransaction, PostedTransaction.Details>;

export interface Session {
  user: User;
  token: string;
  clientSecret: string;
  billingCompany: Company;
  userCompany: Company;
  cards: Card[];
  payments: Payment[];
  drivers: Driver[];
  pendingTransactions: PendingTransaction[];
  postedTransactions: PostedTransaction[];
  postedTransactionsInfo: PostedTransactionList;
  makePaymentAvailability: MakePaymentAvailability;
  invoiceSummary: InvoiceSummary;
  bankAccounts: BankAccount[];

  // Volatile fields
  filteredPendingTransactions: PendingTransaction[];
  filteredPostedTransactions: PostedTransaction[];
  filteredPostedTransactionsInfo: PostedTransactionList;
}

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
      export const PostedTransactionsInfo: Field = "postedTransactionsInfo";
      export const FilteredPendingTransactions: Field = "filteredPendingTransactions";
      export const FilteredPostedTransactions: Field = "filteredPostedTransactions";
      export const FilteredPostedTransactionsInfo: Field = "filteredPostedTransactionsInfo";
      export const Token: Field = "token";
      export const ClientSecret: Field = "clientSecret";
      export const User: Field = "user";
      export const UserCompany: Field = "userCompany";

      export const Static: Field[] = [
        Token,
        ClientSecret,
        User,
        BillingCompany,
        Cards,
        Drivers,
        InvoiceSummary,
        MakePaymentAvailability,
        Payments,
        PendingTransactions,
        PostedTransactions,
        PostedTransactionsInfo,
        UserCompany,
        BankAccounts
      ];

      export const Volatile: Field[] = [
        FilteredPendingTransactions,
        FilteredPostedTransactions,
        FilteredPostedTransactionsInfo
      ];

      export const All: Field[] = [...Static, ...Volatile];
    }
}
