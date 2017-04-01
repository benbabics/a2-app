import { OnlineApplication } from "./online-application";
import { Account } from "./account";

export class User {
    id: string;
    username: string;
    firstName: string;
    onlineApplication: OnlineApplication;
    company?: Account;
    billingCompany?: Account;
    brand?: string;
    email?: string;
}

export namespace User {
    export type Details = User;
}
