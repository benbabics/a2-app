import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Card, CardStatus } from "@angular-wex/models";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { Observable } from "rxjs";
import { TransactionsDateView } from "../transactions/transactions-date-view/transactions-date-view";
import { CardsDetailsPage } from "./details/cards-details";

export type CardsPageNavParams = keyof {
  transactionListMode
};

export namespace CardsPageNavParams {

  export const TransactionListMode: CardsPageNavParams = "transactionListMode";
}

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
@Reactive()
@TabPage()
export class CardsPage extends StaticListPage<Card, Card.Details> {

  private static readonly CARD_STATUSES: CardStatus[] = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Card.Field[] = [
    "embossingValue1",
    "embossingValue2",
    "embossedCardNumber"
  ];

  @StateEmitter.Alias("navParams.data." + CardsPageNavParams.TransactionListMode)
  private transactionListMode$: Observable<boolean>;

  constructor(
    injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super({
      pageName: "Cards",
      listData: Session.Field.Cards,
      listGroupDisplayOrder: CardsPage.CARD_STATUSES,
      dividerLabels: CardsPage.CARD_STATUSES.map(CardStatus.displayName),
      searchFilterFields: CardsPage.SEARCH_FILTER_FIELDS
    }, injector);

    this.transactionListMode$
      .take(1)
      .filter(Boolean)
      .subscribe(() => this.params.trackView = false);

    this.onItemSelected$
      .withLatestFrom(this.transactionListMode$)
      .subscribe((args) => {
        let [card, transactionListMode] = args;

        if (transactionListMode) {
          navCtrl.parent.push(TransactionsDateView, { filterItem: card });
        }
        else {
          navCtrl.push(CardsDetailsPage, { card });
        }
      });
  }

  protected groupItems(cards: Card[]): GroupedList<Card> {
    return StaticListPage.defaultItemGroup<Card, Card.Details>(cards, "status", CardsPage.CARD_STATUSES);
  }

  protected sortItems(cards: Card[]): Card[] {
    return StaticListPage.defaultItemSort<Card, Card.Details>(cards, "cardId", "asc");
  }
}
