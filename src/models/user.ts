import { OnlineApplication } from "./online-application";
import { Company } from "./company";
import { Model } from "./model";

interface UserDetails {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    onlineApplication: OnlineApplication;
    company?: Company.Details;
    billingCompany?: Company.Details;
    brand?: string;
    email?: string;
}

export class User extends Model<UserDetails> {

    public get displayAccountNumber(): string {
      switch (this.details.onlineApplication) {
        case OnlineApplication.WOL_NP:
        case OnlineApplication.DISTRIBUTOR:
          return this.details.billingCompany.accountNumber;
        case OnlineApplication.CLASSIC:
          return this.details.billingCompany.wexAccountNumber;
        default:
          return this.details.billingCompany.accountNumber;
      }
    }

    public get billingCompany(): Company {
      return this.details.billingCompany ? new Company(this.details.billingCompany) : null;
    }

    public get company(): Company {
      return this.details.company ? new Company(this.details.company) : null;
    }

    public get fullName(): string {
      return `${this.details.firstName} ${this.details.lastName}`;
    }
}

export namespace User {
    export type Details = UserDetails;
    export type Field = keyof Details;
}
