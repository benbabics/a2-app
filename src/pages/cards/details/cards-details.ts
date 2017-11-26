import { WexAlertController } from "./../../../components/wex-alert-controller/wex-alert-controller";
import { CardProvider } from "@angular-wex/api-providers";
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { NavParams, ActionSheetController, ToastOptions, NavController } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import * as _ from "lodash";
import { TransactionsDateView } from "../../transactions/transactions-date-view/transactions-date-view";
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
  @EventSource() private onReissue$: Observable<void>;
  @EventSource() private onViewTransactions$: Observable<void>;

  @StateEmitter.From("navParams.data." + CardsDetailsNavParams.Card)
  private card$: Subject<Card>;

  @StateEmitter() private isChangingStatus$: Subject<boolean>;
  @StateEmitter() private statusColor$: Subject<string>;
  @StateEmitter() private statusIcon$: Subject<string>;

  private availableCardStatuses$ = new BehaviorSubject<CardStatusDetails[]>([]);
  private canChangeStatus$ = new BehaviorSubject<boolean>(false);
  private canReissue$ = new BehaviorSubject<boolean>(false);

  constructor(
    injector: Injector,
    navController: NavController,
    public navParams: NavParams,
    private wexAppSnackbarController: WexAppSnackbarController,
    private actionSheetController: ActionSheetController,
    private cardProvider: CardProvider,
    private wexAlertController: WexAlertController
  ) {
    super("Cards.Details", injector);

    if (navParams.get(CardsDetailsNavParams.Reissued)) {
      wexAppSnackbarController.createQueued({
        important: true,
        message: this.CONSTANTS.reissueMessage,
        duration: this.CONSTANTS.reissueMessageDuration,
        position: "top",
      }).present();
    }

    Observable.combineLatest(this.card$, this.sessionCache.session$)
      .subscribe((args) => {
        let [card, session] = args;
        let cardNumber = card.details.embossedCardNumber;
        let cardNumberSuffix = parseInt(cardNumber.substr(cardNumber.length - 1));

        // Distributor users can only reissue active cards. All others can reissue any non-terminated cards.
        this.canChangeStatus$.next(session.user.isDistributor ? card.isActive : !card.isTerminated);

        // Classic users cannot reissue cards ending with '9'
        this.canReissue$.next(!session.user.isClassic || cardNumberSuffix < 9);

        // Non-WOLNP users cannot suspend cards
        let cardStatusFilter = session.user.isWolNp ? Boolean : (details: CardStatusDetails) => details.id !== CardStatus.SUSPENDED;

        this.availableCardStatuses$.next(_.filter<CardStatusDetails>(this.CONSTANTS.statusOptions, cardStatusFilter));

        this.statusColor$.next(this.CONSTANTS.STATUS.COLOR[card.details.status] || "warning");
        this.statusIcon$.next(this.CONSTANTS.STATUS.ICON[card.details.status] || "information-circled");
      });

    this.onChangeStatus$
      .flatMap(() => this.canChangeStatus$.asObservable().take(1))
      .filter(Boolean)
      .flatMap(() => this.availableCardStatuses$.asObservable().take(1))
      .flatMap(cardStatuses => this.changeStatus$(cardStatuses))
      .subscribe(card => this.card$.next(card));

    this.onChangeStatus$
      .flatMap(() => this.canChangeStatus$.asObservable().take(1))
      .filter(canChangeStatus => !canChangeStatus)
      .flatMap(() => this.showChangeStatusAlert$())
      .subscribe();

    this.onReissue$
      .flatMap(() => this.canReissue$.asObservable().take(1))
      .filter(Boolean)
      .flatMap(() => this.card$.asObservable().take(1))
      .subscribe((card) => navController.push(CardsReissuePage, { card }));

    this.onViewTransactions$
      .flatMap(() => this.card$.asObservable().take(1))
      .subscribe((card) => navController.push(TransactionsDateView, { filterItem: card }));
  }

  private changeStatus$(cardStatuses: CardStatusDetails[]): Observable<Card> {
    return this.showStatusSelector$(cardStatuses)
      .flatMap((cardStatus) => {
        if (cardStatus === this.CONSTANTS.statuses.TERMINATED) {
          return this.confirmTermination$()
            .filter(Boolean)
            .flatMap(() => Observable.of(cardStatus));
        }

        return Observable.of(cardStatus);
      })
      .withLatestFrom(this.card$, this.sessionCache.session$)
      .flatMap((args) => {
        let [cardStatus, card, session] = args;

        if (cardStatus === card.details.status) {
          return Observable.of(card);
        }

        let toastOptions: ToastOptions = {
          message: null,
          duration: this.CONSTANTS.reissueMessageDuration,
          position: "top"
        };
        let accountId = session.user.billingCompany.details.accountId;
        let cardId = card.details.cardId;

        this.isChangingStatus$.next(true);

        return this.cardProvider.updateStatus(accountId, cardId, cardStatus)
          .map((card: Card) => {
            // Update the cached cards
            this.sessionCache.update$(Session.Field.Cards).subscribe();

            toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
            return card;
          })
          .catch(() => {
            toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
            return Observable.empty<Card>();
          })
          .finally(() => {
            this.isChangingStatus$.next(false);
            this.wexAppSnackbarController.createQueued(toastOptions).present();
          });
      });
  }

  private confirmTermination$(): Observable<any> {
    return this.wexAlertController.confirmation$(this.CONSTANTS.confirmMessageTerminate);
  }

  private showChangeStatusAlert$(): Observable<any> {
    return this.wexAlertController.alert$(this.CONSTANTS.noReactivation);
  }

  private showStatusSelector$(cardStatuses: CardStatusDetails[]): Observable<CardStatus> {
    let cardStatusSubject = new Subject<CardStatus>();

    this.actionSheetController.create({
      title: this.CONSTANTS.actionStatusTitle,
      buttons: [
        ...cardStatuses.map((action) => ({
          text: action.label,
          icon: !this.platform.is("ios") ? action.icon : null,
          handler: () => cardStatusSubject.next(action.id)
        })),
        {
          text: this.CONSTANTS.actionStatusCancel,
          role: "cancel",
          icon: !this.platform.is("ios") ? "close" : null,
        }
      ]
    }).present();

    return cardStatusSubject.asObservable();
  }
}
