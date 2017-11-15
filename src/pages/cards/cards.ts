import { CardsDetailsPage } from "./details/cards-details";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Card, CardStatus } from "@angular-wex/models";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { Reactive } from "angular-rxjs-extensions";

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

  constructor(
    public navCtrl: NavController,
    injector: Injector,
    public navParams: NavParams
  ) {
    super({
      pageName: "Cards",
      listDataField: Session.Field.Cards,
      listGroupDisplayOrder: CardsPage.CARD_STATUSES,
      dividerLabels: CardsPage.CARD_STATUSES.map(CardStatus.displayName),
      searchFilterFields: CardsPage.SEARCH_FILTER_FIELDS
    }, injector);

    this.onItemSelected$.subscribe(card => this.navCtrl.push(CardsDetailsPage, { card }));
  }

  protected groupItems(cards: Card[]): GroupedList<Card> {
    return StaticListPage.defaultItemGroup<Card, Card.Details>(cards, "status", CardsPage.CARD_STATUSES);
  }

  protected sortItems(cards: Card[]): Card[] {
    return StaticListPage.defaultItemSort<Card, Card.Details>(cards, "cardId", "asc");
  }
}
