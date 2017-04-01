export class Company {
    accountId: string;
    accountNumber: string;
    wexAccountNumber: string;
    name: string;
}

export namespace Company {
    export type Details = Company;
}
