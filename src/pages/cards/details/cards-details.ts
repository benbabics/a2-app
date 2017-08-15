import { WexAlertController } from './../../../components/wex-alert-controller/wex-alert-controller';
import { CardProvider } from '@angular-wex/api-providers';
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { NavParams, App, ActionSheetController, Events, ToastOptions, Platform } from 'ionic-angular';
import { ActionSheetOptions, ActionSheetButton } from "ionic-angular/components/action-sheet/action-sheet-options";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import * as _ from "lodash";

export type CardsDetailsNavParams = keyof {
  card,
  reissued
};
interface CardStatusDetails {
  id: CardStatus;
  label: string;
  trackingId: string;
  icon: string;
}

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
    private app: App,
    private wexAppSnackbarController: WexAppSnackbarController,
    injector: Injector,
    private actionSheetController: ActionSheetController,
    private cardProvider: CardProvider,
    private events: Events,
    private wexAlertController: WexAlertController,
    private platform: Platform
  ) {
    super("Cards.Details", injector);

    this.card = this.navParams.get(CardsDetailsNavParams.Card);
    this.reissued = this.navParams.get(CardsDetailsNavParams.Reissued);
  }

  private reissuedSnackbar(reissued: boolean) {
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
    if (this.canChangeStatus) {
      let actions = this.availableCardStatuses;
      if (!actions || _.isEmpty(actions)) { return; }

      this.actionSheetController.create(this.buildActionSheet(actions)).present();
    }
  }

  private buildActionSheet(actions: CardStatusDetails[]): ActionSheetOptions {

    let buttons: ActionSheetButton[] = actions.map((action) => ({
      text: action.label,
      icon: !this.platform.is("ios") ? action.icon : null,
      handler: () => {
        if (action.id === this.CONSTANTS.statuses.TERMINATED) {
          this.confirmTermination();
        } else {
          this.updateCardStatus(action.id);
        }
      }
    })
    );

    return {
      title: this.CONSTANTS.actionStatusTitle,
      buttons: [
        ...buttons,
        {
          text: this.CONSTANTS.actionStatusCancel,
          role: "cancel",
          icon: !this.platform.is("ios") ? "close" : null,
        }
      ]
    };
  }

  private confirmTermination() {
    let message = this.CONSTANTS.confirmMessageTerminate;
    let yesHandler = () => this.updateCardStatus(this.CONSTANTS.statuses.TERMINATED);
    this.wexAlertController.confirmation(message, yesHandler);
  }

  private updateCardStatus(newStatus: CardStatus) {
    if (newStatus === this.card.details.status) {
      return;
    }

    this.isChangingStatus = true;

    let accountId = this.session.user.billingCompany.details.accountId;
    let cardId = this.card.details.cardId;

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.reissueMessageDuration,
      position: 'top',
    };

    this.cardProvider.updateStatus(accountId, cardId, newStatus).subscribe(
      (card: Card) => {
        this.card.details.status = card.details.status;
        this.isChangingStatus = false;
        this.events.publish("cards:statusUpdate");

        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      }, () => {
        this.isChangingStatus = false;
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
  }

  private get availableCardStatuses(): Array<CardStatusDetails> {
    let statuses: CardStatusDetails[] = this.CONSTANTS.statusOptions;
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
    if (this.canReissue) {
      this.app.getRootNav().push(CardsReissuePage, { card: this.card });
    }
  }
}
