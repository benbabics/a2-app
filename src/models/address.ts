import { Model } from "./model";
import { AddressValidators } from "../validators";

interface AddressDetails {
  firstName: string;
  lastName: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  residence: boolean;
}

export class Address extends Model<AddressDetails> {

  public get fullName(): string {
    return `${this.details.firstName} ${this.details.lastName}`;
  }

  public get isPoBox(): boolean {
    return AddressValidators.isPoBox(this.details.addressLine1) || AddressValidators.isPoBox(this.details.addressLine2);
  }
}

export namespace Address {
    export type Details = AddressDetails;
    export type Field = keyof Details;
}
