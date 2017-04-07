import { Model } from "./model";

interface CompanyDetails {
    accountId: string;
    accountNumber: string;
    wexAccountNumber: string;
    name: string;
}

export class Company extends Model<CompanyDetails> { }

export namespace Company {
    export type Details = CompanyDetails;
    export type Field = keyof Details;
}
