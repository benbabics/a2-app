import { WexAlertController } from "./../../../components/wex-alert-controller/wex-alert-controller";
import { CardsReissuePage } from "./../reissue/cards-reissue";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Card } from "@angular-wex/models";
import { WexAppSnackbarController } from "../../../components";
import { TransactionsDateView } from "../../transactions/transactions-date-view/transactions-date-view";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { NavParams, NavController } from "ionic-angular";
import { CardChangeStatusPage } from "./change-status/change-status";

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
    navController: NavController,
    navParams: NavParams,
    wexAppSnackbarController: WexAppSnackbarController,
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

        let cardNo = String(card.details.embossedCardNumber).slice(-5);
        this.lastFiveEmbossedCardNumber$.next(cardNo);

        // Distributor users can only reissue active cards. All others can reissue any non-terminated cards.
        this.canChangeStatus$.next(session.user.isDistributor ? card.isActive : !card.isTerminated);

        // Classic users cannot reissue cards ending with '9'
        this.canReissue$.next(cardNumberSuffix < 9);
      });

    this.onChangeStatus$
      .flatMap(() => this.canChangeStatus$.asObservable().take(1))
      .filter(Boolean)
      .flatMap(() => this.card$.asObservable().take(1))
      .subscribe((card) => navController.push(CardChangeStatusPage, { card }));

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
