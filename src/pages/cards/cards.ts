import { CardsDetailsPage } from "./details/cards-details";
import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { CardProvider } from "../../providers";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Card, CardStatus } from "../../models";

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends StaticListPage<Card, Card.Details> {

  private static readonly CARD_STATUSES: CardStatus[] = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Card.Field[] = [
    "embossingValue1",
    "embossingValue2",
    "cardId"
  ];

  protected readonly listGroupDisplayOrder: string[] = CardsPage.CARD_STATUSES;
  public readonly dividerLabels: string[] = CardsPage.CARD_STATUSES.map(CardStatus.displayName);

  constructor(public navCtrl: NavController, public navParams: NavParams, private cardProvider: CardProvider) {
    super("Cards", CardsPage.SEARCH_FILTER_FIELDS);
  }

  protected groupItems(cards: Card[]): GroupedList<Card> {
    return this.defaultItemGroup(cards, "status", CardsPage.CARD_STATUSES);
  }

  protected sortItems(cards: Card[]): Card[] {
    return this.defaultItemSort(cards, "cardId", "asc");
  }

  protected search(): Observable<Card[]> {
    return this.cardProvider.search(this.session.details.user.company.details.accountId)
  }

  public goToDetailPage(card: Card) {
    this.navCtrl.push(CardsDetailsPage, { card });
  }
}
