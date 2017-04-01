import { OnlineApplication } from "./online-application";
import { Company } from "./company";

export class User {
    id: string;
    username: string;
    firstName: string;
    onlineApplication: OnlineApplication;
    company?: Company;
    billingCompany?: Company;
    brand?: string;
    email?: string;
}

export namespace User {
    export type Details = User;
}
