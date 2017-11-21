import { WexAlertController } from "./../../../components/wex-alert-controller/wex-alert-controller";
import { CardProvider, TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { NavParams, App, ActionSheetController, ToastOptions, Platform, NavController } from "ionic-angular";
import { ActionSheetOptions, ActionSheetButton } from "ionic-angular/components/action-sheet/action-sheet-options";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import * as _ from "lodash";
import { TransactionsPage, TransactionListType } from "../../transactions/transactions";
import { Session } from "../../../models";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable, BehaviorSubject } from "rxjs";

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
@Reactive()
export class CardsDetailsPage extends DetailsPage {

  @EventSource() private onChangeStatus$: Observable<void>;

  @StateEmitter.Alias("navParams.data." + CardsDetailsNavParams.Card)
  private card$: Observable<Card>;

  @StateEmitter.From("navParams.data." + CardsDetailsNavParams.Reissued)
  private reissued$: Subject<boolean>;

  @StateEmitter() private isChangingStatus$: Subject<boolean>;
  @StateEmitter() private canChangeStatus$: Subject<boolean>;
  @StateEmitter() private canReissue$: Subject<boolean>;

  private availableCardStatuses$ = new BehaviorSubject<CardStatusDetails[]>([]);

  constructor(
    public navParams: NavParams,
    private app: App,
    private wexAppSnackbarController: WexAppSnackbarController,
    injector: Injector,
    private actionSheetController: ActionSheetController,
    private cardProvider: CardProvider,
    private wexAlertController: WexAlertController,
    private navController: NavController,
    private platform: Platform
  ) {
    super("Cards.Details", injector);

    Observable.combineLatest(this.card$, this.sessionCache.session$)
      .subscribe((args) => {
        let [card, session] = args;
        let cardNumber = card.details.embossedCardNumber;
        let cardNumberSuffix = parseInt(cardNumber.substr(cardNumber.length - 1));
        // Only WOL_NP with "Active" status can "Suspended" Cards
        let rejectionAttrs = (!session.user.isWolNp && card.isActive) ? { id: "SUSPENDED" } : false;

        // Distributor users can only reissue active cards. All others can reissue any non-terminated cards.
        this.canChangeStatus$.next(session.user.isDistributor ? card.isActive : !card.isTerminated);

        this.canReissue$.next(!session.user.isClassic || cardNumberSuffix < 9);

        // will not reject an iteratee when rejectionAttrs is false
        this.availableCardStatuses$.next(_.reject(this.CONSTANTS.statusOptions, rejectionAttrs));
      });

    this.reissued$.subscribe(reissued => this.reissuedSnackbar(reissued));

    this.onChangeStatus$
      .flatMap(() => Observable.combineLatest(this.canChangeStatus$, this.availableCardStatuses$).take(1))
      .subscribe((args) => {
        let [canChangeStatus, cardStatuses] = args;

        if (canChangeStatus) {
          this.changeStatus(cardStatuses);
        }
        else {
          this.cannotChangeStatusMessage();
        }
      });
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

  public changeStatus(cardStatuses: CardStatusDetails[]) {
    if (!_.isEmpty(cardStatuses)) {
      this.actionSheetController.create(this.buildActionSheet(cardStatuses)).present();
    }
  }

  public cannotChangeStatusMessage() {
    this.wexAlertController.alert(this.CONSTANTS.noReactivation);
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
    }));

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
      position: "top",
    };

    this.cardProvider.updateStatus(accountId, cardId, newStatus).subscribe(
      (card: Card) => {
        this.card.details.status = card.details.status;
        this.isChangingStatus = false;

        this.sessionCache.update$(Session.Field.Cards).subscribe();

        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      }, () => {
        this.isChangingStatus = false;
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
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

  public viewTransactions() {
    this.navController.push(TransactionsPage, {
      selectedList: TransactionListType.Date,
      filter: [TransactionSearchFilterBy.Card, this.card.details.cardId]
    });
  }
}
