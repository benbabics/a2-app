export class Account {
    accountId: string;
    accountNumber: string;
    wexAccountNumber: string;
    name: string;
}

export namespace Account {
    export type Details = Account;
}
