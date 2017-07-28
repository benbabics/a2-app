import { ToastOptions } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CardProvider } from '@angular-wex/api-providers';
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { NavParams, App, ActionSheetController, Events, AlertController, ToastOptions } from 'ionic-angular';
import { ActionSheetOptions, ActionSheetButton } from "ionic-angular/components/action-sheet/action-sheet-options";
import { DetailsPage } from "../../details-page";
import { Card } from "@angular-wex/models";
import { SessionManager } from "../../../providers";
import { WexAppSnackbarController } from "../../../components";
import { CardStatus } from "@angular-wex/api-providers";
import * as _ from "lodash";
import { Value } from '../../../decorators/value';

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
  @Value("BUTTONS") private BUTTONS;

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
    private alertController: AlertController
  ) {
    super("Cards.Details", injector);

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

  private buildActionSheet(actions: CardsDetailsNavParams.Status[]): ActionSheetOptions {

    let buttons: ActionSheetButton[] = actions.map((action) => ({
      text: action.label,
      handler: () => {
        let statuses: CardsDetailsNavParams.Status[] = this.CONSTANTS.statuses;
        if (action.id === "TERMINATED") {
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
          role: "cancel"
        }
      ]
    };
  }

  private confirmTermination() {
    this.alertController.create({
      message: this.CONSTANTS.confirmMessageTerminate,
      buttons: [
        {
          text: this.BUTTONS.YES,
          handler: () => {
            this.updateCardStatus("TERMINATED");
          }
        },
        {
          text: this.BUTTONS.NO
        }
      ]
    }).present();
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
        duration: this.CONSTANTS.bannerStatusChangeFailure,
        position: 'top',
      };

    let updateObservable = this.cardProvider.updateStatus(accountId, cardId, newStatus);
    updateObservable.catch((error) => {
      toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
      this.wexAppSnackbarController.createQueued(toastOptions).present();
      return new Observable(error);
    });

    updateObservable.subscribe((card: Card) => {
      this.card.details.status = card.details.status;
      this.isChangingStatus = false;
      this.events.publish("cards:statusUpdate");

      toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
      this.wexAppSnackbarController.createQueued(toastOptions).present();
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
    if (this.canReissue) {
      this.app.getRootNav().push(CardsReissuePage, { card: this.card });
    }
  }
}
