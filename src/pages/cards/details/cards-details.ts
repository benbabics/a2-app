import { TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Card } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import { TransactionDateSublist } from "../../transactions/transactions-date-view/transactions-date-view";
import { CardChangeStatusPage } from "./change-status/change-status";
import { WexPlatform } from "../../../providers";

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
    this.reissuedSnackbar(reissued);
  }
  public get reissued(): boolean {
    return this._reissued;
  }
  public isChangingStatus: boolean = false;

  constructor(
    public navParams: NavParams,
    public platform: WexPlatform,
    private wexAppSnackbarController: WexAppSnackbarController,
    injector: Injector,
    private navController: NavController
  ) {
    super("Cards.Details", injector);

    this.card = this.navParams.get(CardsDetailsNavParams.Card);
    this.reissued = this.navParams.get(CardsDetailsNavParams.Reissued);
  }

  private reissuedSnackbar(reissued: boolean) {
    if (reissued) {
      this.wexAppSnackbarController.createQueued({
        important: true,
        message: this.CONSTANTS.reissueMessage,
        duration: this.CONSTANTS.reissueMessageDuration,
        position: "top",
      }).present();
    }
  }

  public get lastFiveEmbossedCardNumber(): string {
    return String(this.card.details.embossedCardNumber).slice(-5);
  }

  public get canChangeStatus(): boolean {
    // Rules in MOBACCTMGT-1135 AC #1
    if (this.session.user.isDistributor) { return this.card.isActive; }
    return !this.card.isTerminated;
  }

  public get canReissue(): boolean {
    let isClassic = this.session.user.isClassic,
      cardNo = this.card.details.embossedCardNumber,
      cardNoSuffix = parseInt(cardNo.substr(cardNo.length - 1));

    return !isClassic || (isClassic && cardNoSuffix < 9);
  }

  public changeStatus() {
    const card = this.card;
    this.navController.push(CardChangeStatusPage, { card });
  }

  public goToReissuePage() {
    if (this.canReissue) {
      this.navController.push(CardsReissuePage, { card: this.card });
    }
  }

  public viewTransactions() {
    this.navController.push(TransactionDateSublist, {
      filter: [TransactionSearchFilterBy.Card, this.card.details.cardId]
    });
  }
}
