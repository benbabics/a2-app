import { OnlineApplication } from "./online-application";
import { CompanyStub } from "./company-stub";
import { Model } from "./model";

interface UserDetails {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    onlineApplication: OnlineApplication;
    company?: CompanyStub.Details;
    billingCompany?: CompanyStub.Details;
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

    public get billingCompany(): CompanyStub {
      return this.details.billingCompany ? new CompanyStub(this.details.billingCompany) : null;
    }

    public get company(): CompanyStub {
      return this.details.company ? new CompanyStub(this.details.company) : null;
    }

    public get fullName(): string {
      return `${this.details.firstName} ${this.details.lastName}`;
    }
}

export namespace User {
    export type Details = UserDetails;
    export type Field = keyof Details;
}
