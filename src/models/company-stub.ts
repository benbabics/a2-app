import { Model } from "./model";

interface CompanyStubDetails {
    accountId: string;
    accountNumber: string;
    wexAccountNumber: string;
    name: string;
}

export class CompanyStub extends Model<CompanyStubDetails> { }

export namespace CompanyStub {
    export type Details = CompanyStubDetails;
    export type Field = keyof Details;
}
