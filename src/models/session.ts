import { User } from "./user";
import { Model } from "./model";

export type SessionField = keyof Session.Details;

class SessionDetails extends Model<SessionDetails> {
    readonly user: User;
    readonly token: string;
}

export class Session extends SessionDetails {

    public constructor(details: SessionDetails) {
        super(details);
    }
}

export namespace Session {
    export type Details = SessionDetails;
}
