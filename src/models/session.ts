import { User } from "./user";
import { Model } from "./model";
import { Company } from "./company";

interface SessionDetails {
    user: User.Details;
    token: string;
    billingCompany?: Company.Details;
    userCompany?: Company.Details;
}

export abstract class SessionBase<T extends Partial<SessionDetails>> extends Model<T> {

  public get billingCompany(): Company {
    return this.details.billingCompany ? new Company(this.details.billingCompany) : null;
  }

  public get user(): User {
    return this.details.user ? new User(this.details.user) : null;
  }

  public get userCompany(): Company {
    return this.details.userCompany ? new Company(this.details.userCompany) : null;
  }
}

export class Session extends SessionBase<SessionDetails> { }

export class SessionPartial extends SessionBase<Partial<SessionDetails>> {
  constructor(details?: Partial<SessionDetails>) {
    super(details);
  }
 }

export namespace Session {
    export type Details = SessionDetails;
    export type Field = keyof Details;

    export namespace Field {
      export const BillingCompany: Field = "billingCompany";
      export const Token: Field = "token";
      export const User: Field = "user";
      export const UserCompany: Field = "userCompany";

      export const All: Field[] = [Token, User, BillingCompany, UserCompany];
    }
}
