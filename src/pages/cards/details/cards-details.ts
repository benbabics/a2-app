import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component } from "@angular/core";
import { NavParams, App } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { SessionManager } from "../../../providers";

export type CardsDetailsNavParams = keyof {
  card,
  reissued
};

export namespace CardsDetailsNavParams {
  export const Card: CardsDetailsNavParams = "card";
  export const Reissued: CardsDetailsNavParams = "reissued";
}

@Component({
  selector: "page-cards-details",
  templateUrl: "cards-details.html"
})
export class CardsDetailsPage extends DetailsPage {

  public card: Card;
  public reissued: boolean;

  constructor(
    sessionManager: SessionManager,
    public navParams: NavParams,
    private app: App
  ) {
    super("Cards.Details", sessionManager);

    this.card = this.navParams.get(CardsDetailsNavParams.Card);
    this.reissued = this.navParams.get(CardsDetailsNavParams.Reissued);
  }

  public get canChangeStatus(): boolean {
    return this.session.user.isDistributor ? !this.card.isSuspended : !this.card.isTerminated;
  }

  public get canReissue(): boolean {
    let isClassic    = this.session.user.isClassic,
        cardNo       = this.card.details.embossedCardNumber,
        cardNoSuffix = parseInt( cardNo.substr(cardNo.length - 1) );

    return !isClassic || ( isClassic && cardNoSuffix < 9 );
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[this.card.details.status] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[this.card.details.status] || "information-circled";
  }

  public goToReissuePage() {
    if ( this.canReissue ) {
      this.app.getRootNav().push(CardsReissuePage, { card: this.card });
    }
  }
}
