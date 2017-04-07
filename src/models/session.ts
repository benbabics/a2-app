import { User } from "./user";
import { Model } from "./model";

interface SessionDetails {
    readonly user: User;
    readonly token: string;
}

export class Session extends Model<SessionDetails> { }

export namespace Session {
    export type Details = SessionDetails;
    export type Field = keyof Details;
}
