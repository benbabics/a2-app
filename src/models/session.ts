import { User } from "./user";
import { Company } from "./company";
import { Card } from "./card";
import { Payment } from "./payment";
import { Driver } from "./driver";
import { Transaction } from "./transaction";

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
}>;

export namespace Session {
    export type Field = keyof Session;

    export namespace Field {
      export const BillingCompany: Field = "billingCompany";
      export const Cards: Field = "cards";
      export const Drivers: Field = "drivers";
      export const Payments: Field = "payments";
      export const PendingTransactions: Field = "pendingTransactions";
      export const PostedTransactions: Field = "postedTransactions";
      export const Token: Field = "token";
      export const User: Field = "user";
      export const UserCompany: Field = "userCompany";

      export const All: Field[] = [
        Token,
        User,
        BillingCompany,
        Cards,
        Drivers,
        Payments,
        //PendingTransactions,
        //PostedTransactions,
        UserCompany
      ];
    }
}
