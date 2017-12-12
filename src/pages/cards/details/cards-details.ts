import { WexAlertController } from "./../../../components/wex-alert-controller/wex-alert-controller";
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Card, CardStatus } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import { TransactionsDateView } from "../../transactions/transactions-date-view/transactions-date-view";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { NavParams, NavController } from "ionic-angular";
import { SelectionPageController } from "../../../providers/index";
import { Session } from "../../../models/index";
import { SelectionItem } from "../../generic/index";
import { ToastOptions } from "ionic-angular/components/toast/toast-options";
import { CardProvider } from "@angular-wex/api-providers";

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
@Reactive()
export class CardsDetailsPage extends DetailsPage {

  @EventSource() private onChangeStatus$: Observable<void>;
  @EventSource() private onReissue$: Observable<void>;
  @EventSource() private onViewTransactions$: Observable<void>;

  @StateEmitter.From("navParams.data." + CardsDetailsNavParams.Card)
  private card$: Subject<Card>;

  @StateEmitter() private canChangeStatus$: Subject<boolean>;
  @StateEmitter() private lastFiveEmbossedCardNumber$: Subject<string>;

  private canReissue$ = new BehaviorSubject<boolean>(false);

  constructor(
    injector: Injector,
    selectionPageController: SelectionPageController,
    navController: NavController,
    wexAppSnackbarController: WexAppSnackbarController,
    cardProvider: CardProvider,
    private navParams: NavParams,
    private wexAlertController: WexAlertController
  ) {
    super("Cards.Details", injector);

    if (this.navParams.get(CardsDetailsNavParams.Reissued)) {
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

        let cardNo = String(card.details.embossedCardNumber).slice(-5);
        this.lastFiveEmbossedCardNumber$.next(cardNo);

        // Distributor users can only reissue active cards. All others can reissue any non-terminated cards.
        this.canChangeStatus$.next(session.user.isDistributor ? card.isActive : !card.isTerminated);

        // Classic users cannot reissue cards ending with '9'
        this.canReissue$.next(cardNumberSuffix < 9);
      });

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.reissueMessageDuration,
      position: "top"
    };

    this.onChangeStatus$
      .flatMap(() => this.canChangeStatus$.asObservable().take(1))
      .filter(Boolean)
      .flatMap(() => this.card$.asObservable().take(1))
      .withLatestFrom(this.sessionCache.session$)
      .flatMap(args => {
        let [card, session]: [Card, Session] = args;
        let options: SelectionItem<CardStatus>[] = [];
        options.push({ value: CardStatus.ACTIVE, label: CardStatus.displayName(CardStatus.ACTIVE) });
        if (session.user.isWolNp) {
          options.push({ value: CardStatus.SUSPENDED, label: CardStatus.displayName(CardStatus.SUSPENDED) });
        }
        options.push({ value: CardStatus.TERMINATED, label: CardStatus.displayName(CardStatus.TERMINATED) });
        return selectionPageController.presentSelectionPage({
          pageName: this.CONSTANTS.CHANGE_STATUS.title,
          options,
          submittedItem: card.details.status,
          submitButtonText: this.CONSTANTS.CHANGE_STATUS.LABELS.select,
          selfDismiss: false
        });
      })
      .flatMap(status => {
        if (status === CardStatus.TERMINATED) {
          return this.wexAlertController
            .confirmation$(this.CONSTANTS.CHANGE_STATUS.confirmMessageTerminate)
            .filter(Boolean)
            .flatMapTo(Observable.of(status));
        } else {
          return Observable.of(status);
        }})
      .withLatestFrom(this.card$, this.sessionCache.session$)
      .flatMap((args) => {
        let [status, card, session] = args;
        let accountId = session.user.billingCompany.details.accountId;
        let cardId = card.details.cardId;

        navController.pop();
        return cardProvider.updateStatus(accountId, cardId, status);
      })
      .map(updatedCard => {
        toastOptions.message = this.CONSTANTS.CHANGE_STATUS.bannerStatusChangeSuccess;
        this.card$.next(updatedCard);
      })
      .catch(() => {
        toastOptions.message = this.CONSTANTS.CHANGE_STATUS.bannerStatusChangeFailure;
        return Observable.empty<Card>();
      })
      .finally(() => wexAppSnackbarController.createQueued(toastOptions).present())
      .subscribe();

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

  private showChangeStatusAlert$(): Observable<any> {
    return this.wexAlertController.alert$(this.CONSTANTS.noReactivation);
  }
}
