import { OnlineApplication } from "./online-application";
import { Company } from "./company";
import { Model } from "./model";

export type UserField = keyof User.Details;

export class UserDetails extends Model<UserDetails> {
    id: string;
    username: string;
    firstName: string;
    onlineApplication: OnlineApplication;
    company?: Company;
    billingCompany?: Company;
    brand?: string;
    email?: string;
}

export class User extends UserDetails {

    public constructor(details: UserDetails) {
      super(details);
    }

    public get displayAccountNumber(): string {
      switch (this.onlineApplication) {
        case OnlineApplication.WOL_NP:
        case OnlineApplication.DISTRIBUTOR:
          return this.billingCompany.accountNumber;
        case OnlineApplication.CLASSIC:
          return this.billingCompany.wexAccountNumber;
        default:
          return this.billingCompany.accountNumber;
      }
    }
}

export namespace User {
    export type Details = UserDetails;
}
