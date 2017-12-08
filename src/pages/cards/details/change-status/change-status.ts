import * as _ from "lodash";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Component, Injector } from "@angular/core";
import { SecurePage } from "../../../secure-page";
import { Card, CardStatus } from "@angular-wex/models";
import { CardProvider } from "@angular-wex/api-providers";
import { WexPlatform } from "../../../../providers";
import { NavController, NavParams, ToastOptions } from "ionic-angular";
import { WexAppSnackbarController } from "../../../../components";
import { WexAlertController } from "./../../../../components/wex-alert-controller/wex-alert-controller";
import { Reactive, EventSource, StateEmitter } from "angular-rxjs-extensions";
import { Session } from "../../../../models/session";

@Component({
  selector: "page-card-change-status",
  templateUrl: "change-status.html"
})
@Reactive()
export class CardChangeStatusPage extends SecurePage {

  @EventSource() private onChangeStatus$: Observable<boolean>;

  @StateEmitter.From("navParams.data.card")
  private card$: Subject<Card>;

  @StateEmitter.From("card$.details.status")
  private cardStatus$: Subject<CardStatus>;

  @StateEmitter() private isChangingStatus$: Subject<boolean>;
  @StateEmitter() private disableChangeStatus$: Subject<boolean>;
  @StateEmitter() private availableCardStatuses$: BehaviorSubject<CardStatus[]>;

  // private availableCardStatuses$ = new BehaviorSubject<CardStatus[]>([]);
  private readonly statusOptions: CardStatus[] = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED];

  constructor(
    injector: Injector,
    public navParams: NavParams,
    public platform: WexPlatform,
    private navCtrl: NavController,
    private cardProvider: CardProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
    private wexAlertController: WexAlertController
  ) {
    super({ pageName: "Cards.Change_Status" }, injector);

    this.sessionCache.session$
      .subscribe(session => {
        // Non-WOLNP users cannot suspend cards
        let cardStatusFilter = session.user.isWolNp ? Boolean : (status: CardStatus) => status !== CardStatus.SUSPENDED;
        this.availableCardStatuses$.next(_.filter<CardStatus>(this.statusOptions, cardStatusFilter));
      });

    this.onChangeStatus$
      .flatMap(() => this.cardStatus$.asObservable().take(1))
      .flatMap((cardStatus) => {
        if (cardStatus === CardStatus.TERMINATED) {
          return this.confirmTermination$()
            .filter(Boolean)
            .flatMap(() => Observable.of(cardStatus));
        }

        return Observable.of(cardStatus);
      })
      .withLatestFrom(this.card$, this.sessionCache.session$)
      .flatMap(args => this.changeStatus$(args[0], args[1], args[2]))
      .subscribe(card => this.card$.next(card));

    Observable.combineLatest(this.card$, this.cardStatus$, this.isChangingStatus$)
      .subscribe(args => {
        let [card, cardStatus, isChangingStatus] = args;
        const matchingStatus = cardStatus === card.details.status;
        this.disableChangeStatus$.next(matchingStatus || isChangingStatus);
      });
  }

  public displayOptionLabel(status: CardStatus) {
    return CardStatus.displayName(status);
  }

  private changeStatus$(cardStatus: CardStatus, card: Card, session: Session): Observable<Card> {
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
      .map((updatedCard: Card) => {
        card.details.status = updatedCard.details.status;
        this.sessionCache.update$(Session.Field.Cards).subscribe();
        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.navCtrl.pop();

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
  }

  private confirmTermination$(): Observable<any> {
    return this.wexAlertController.confirmation$(this.CONSTANTS.confirmMessageTerminate);
  }
}
