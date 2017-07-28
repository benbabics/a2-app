import { CardProvider } from '@angular-wex/api-providers';
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component } from "@angular/core";
import { NavParams, App, ActionSheetController, Events } from 'ionic-angular';
import { ActionSheetOptions, ActionSheetButton } from "ionic-angular/components/action-sheet/action-sheet-options";
import { DetailsPage } from "../../details-page";
import { Card } from "@angular-wex/models";
import { SessionManager } from "../../../providers";
import { WexAppSnackbarController } from "../../../components";
import { CardStatus } from "@angular-wex/api-providers";
import * as _ from "lodash";

export type CardsDetailsNavParams = keyof {
  card,
  reissued
};

export namespace CardsDetailsNavParams {
  export const Card: CardsDetailsNavParams = "card";
  export const Reissued: CardsDetailsNavParams = "reissued";
  export interface Status {
    id: CardStatus;
    label: string;
    trackingId: string;
  };
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
    sessionManager: SessionManager,
    public navParams: NavParams,
    private app: App,
    private wexAppSnackbarController: WexAppSnackbarController,
    private actionSheetController: ActionSheetController,
    private cardProvider: CardProvider,
    private events: Events
  ) {
    super("Cards.Details", sessionManager);

    this.card = this.navParams.get(CardsDetailsNavParams.Card);
    this.reissued = this.navParams.get(CardsDetailsNavParams.Reissued);
  }

  private reissuedSnackbar(reissued: Boolean) {
    if (reissued) {
      this.wexAppSnackbarController.createQueued({
        message: this.CONSTANTS.reissueMessage,
        duration: this.CONSTANTS.reissueMessageDuration,
        position: 'top',
      }).present();
    }
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

  public changeStatus() {
    if (this.canChangeStatus) {
      let actions = this.availableCardStatuses;
      if (!actions || _.isEmpty(actions)) { return; }

      this.actionSheetController.create(this.buildActionSheet(actions)).present();
    }
  }

  private buildActionSheet(actions: CardsDetailsNavParams.Status[]): ActionSheetOptions {

    let buttons: ActionSheetButton[] = actions.map((action) => ({
        text: action.label,
        handler: () => {
          let statuses: CardsDetailsNavParams.Status[] = this.CONSTANTS.statuses;
          this.updateCardStatus( action.id );
        }
      })
    );

    return {
      title: this.CONSTANTS.actionStatusTitle,
      buttons: [
        ...buttons,
        {
          text: this.CONSTANTS.actionStatusCancel,
          role: "cancel"
        }
      ]
    };
  }

  private updateCardStatus(newStatus: CardStatus) {
    if( newStatus === this.card.details.status ) {
      return;
    }

    this.isChangingStatus = true;

    let accountId = this.session.user.billingCompany.details.accountId;
    let cardId = this.card.details.cardId;

    this.cardProvider.updateStatus(accountId, cardId, newStatus).subscribe((card: Card) => {
      this.card.details.status = card.details.status;
      this.isChangingStatus = false;
      this.events.publish("cards:statusUpdate");
    });
    
  }

  private get availableCardStatuses(): Array<CardsDetailsNavParams.Status> {
    let statuses: CardsDetailsNavParams.Status[] = this.CONSTANTS.statuses;
    let isWOLNP = this.session.user.isWolNp;
    let rejectionAttrs;
    // Only WOL_NP with "Active" status can "Suspended" Cards
    if (!isWOLNP && this.card.isActive) {
      rejectionAttrs = { id: "SUSPENDED" };
    }

    // will not reject an iteratee when rejectionAttrs is false
    return _.reject(statuses, rejectionAttrs || false);
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
