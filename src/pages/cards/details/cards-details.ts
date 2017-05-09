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

  public get canReissue(): boolean {
    return this.card.details.status !== CardStatus.TERMINATED;
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[this.card.details.status] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[this.card.details.status] || "information-circled";
  }

  public goToReissuePage() {
    this.app.getRootNav().push(CardsReissuePage, { card: this.card });
  }
}
