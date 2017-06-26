import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component } from "@angular/core";
import { NavParams, App } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { SessionManager } from "../../../providers";
import { WexAppSnackbarController } from "../../../components";

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
  private _reissued: boolean;
  public set reissued(reissued: boolean) {
    this._reissued = reissued;
    if (reissued) {
      this.wexAppSnackbarController.uniqueToast({
        message: this.CONSTANTS.reissueMessage,
        duration: this.CONSTANTS.reissueMessageDuration,
        position: 'top'
      });
    }
  }
  public get reissued(): boolean {
    return this._reissued;
  }

  constructor(
    sessionManager: SessionManager,
    public navParams: NavParams,
    private app: App,
    private wexAppSnackbarController: WexAppSnackbarController
  ) {
    super("Cards.Details", sessionManager);

    this.card = this.navParams.get(CardsDetailsNavParams.Card);
    this.reissued = this.navParams.get(CardsDetailsNavParams.Reissued);
  }

  public get canChangeStatus(): boolean {
    // Rules in MOBACCTMGT-1135 AC #1
    if ( this.session.user.isDistributor ) { return this.card.isActive; }
    return !this.card.isTerminated;
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
