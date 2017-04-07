import { Model } from "./model";
import { CardStatus } from "./card-status";

interface CardDetails {
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

export class Card extends Model<CardDetails> {

    public constructor(details: CardDetails) {
        super(details);
    }

    public get isActive(): boolean {
      return this.details.status === CardStatus.ACTIVE;
    }

    public get isSuspended(): boolean {
      return this.details.status === CardStatus.SUSPENDED;
    }

    public get isTerminated(): boolean {
      return this.details.status === CardStatus.TERMINATED;
    }

    public get statusDisplayName(): string {
      return CardStatus.displayName(this.details.status);
    }
}

export namespace Card {
    export type Details = CardDetails;
    export type Field = keyof Details;
}
