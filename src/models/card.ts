import { Model } from "./model";
import { CardStatus } from "./card-status";

export type CardField = keyof Card.Details;

class CardDetails extends Model<CardDetails> {
   cardId: string;
   accountId: string;
   cardType: string;
   embossedAccountNumber: string;
   embossedCardNumber: string;
   embossingValue1: string;
   embossingValue2: string;
   embossingValue3: string;
   status: CardStatus;
}

export class Card extends CardDetails {

    public constructor(details: CardDetails) {
        super(details);
    }

    public get isActive(): boolean {
      return this.status === CardStatus.ACTIVE;
    }

    public get isSuspended(): boolean {
      return this.status === CardStatus.SUSPENDED;
    }

    public get isTerminated(): boolean {
      return this.status === CardStatus.TERMINATED;
    }

    public get statusDisplayName(): string {
      return CardStatus.displayName(this.status);
    }
}

export namespace Card {
    export type Details = CardDetails;
}
