import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { SecurePage } from "../../../secure-page";
import { Card, CardStatus } from "@angular-wex/models";
import { CardProvider } from "@angular-wex/api-providers";
import { WexPlatform } from "../../../../providers";
import { NavController, NavParams, Events, ToastOptions } from "ionic-angular";
import { WexAppSnackbarController } from "../../../../components";
import { WexAlertController } from "./../../../../components/wex-alert-controller/wex-alert-controller";

@Component({
  selector: "page-card-change-status",
  templateUrl: "change-status.html"
})
export class CardChangeStatusPage extends SecurePage {
  public card: Card;
  public cardStatus: CardStatus;
  public statusOptions: CardStatus[];
  public isChangingStatus: boolean = false;

  constructor(
    injector: Injector,
    public platform: WexPlatform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private cardProvider: CardProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
    private wexAlertController: WexAlertController
  ) {
    super({ pageName: "Cards.Change_Status" }, injector);
    this.card = this.navParams.get("card");
    this.cardStatus = this.card.details.status;
    this.statusOptions = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED]; //this.availableCardStatuses;
  }

  public get disableChangeStatus(): boolean {
    const matchingStatus = this.cardStatus === this.card.details.status;
    return matchingStatus || this.isChangingStatus;
  }

  public displayOptionLabel(status: CardStatus) {
    return CardStatus.displayName(status);
  }

  public handleSelectStatus() {
    if (this.cardStatus === this.card.details.status) {
      return;
    }
    else if (this.cardStatus === CardStatus.TERMINATED) {
      this.confirmTermination();
    }
    else {
      this.updateCardStatus();
    }
  }

  private get availableCardStatuses(): Array<CardStatus> {
    let isWOLNP = this.session.user.isWolNp;
    const statuses: CardStatus[] = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED];

    // Only WOL_NP with "Active" status can "Suspended" cards
    if (isWOLNP && this.card.isActive) {
      return statuses;
    }

    // not allowed to suspend cards
    return _.pull(statuses, CardStatus.SUSPENDED);
  }

  private confirmTermination() {
    let message = this.CONSTANTS.confirmMessageTerminate;
    let yesHandler = () => this.updateCardStatus();
    this.wexAlertController.confirmation(message, yesHandler);
  }

  private updateCardStatus() {
    let cardId    = this.card.details.cardId;
    let accountId = this.session.user.billingCompany.details.accountId;

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.statusUpdateMessageDuration,
      position: "top"
    };

    this.isChangingStatus = true;

    this.cardProvider.updateStatus(accountId, cardId, this.cardStatus).subscribe(
      (card: Card) => {
        this.card.details.status = card.details.status;
        this.isChangingStatus = false;
        this.events.publish("cards:statusUpdate");

        this.navCtrl.pop();
        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.wexAppSnackbarController.createQueued({ ...toastOptions, important: true }).present();
      }, () => {
        this.isChangingStatus = false;
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
  }
}
