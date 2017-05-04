import { Observable } from "rxjs";
import { CardsDetailsPage } from "./details/cards-details";
import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SessionManager } from "../../providers";
import { StaticListPage, GroupedList, FetchOptions } from "../static-list-page";
import { Card, CardStatus, Session } from "../../models";

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

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Cards", sessionManager, CardsPage.SEARCH_FILTER_FIELDS);
  }

  protected fetch(options?: FetchOptions): Observable<Card[]> {
    return this.sessionManager.cache.getSessionDetail(Session.Field.Cards, options);
  }

  protected groupItems(cards: Card[]): GroupedList<Card> {
    return this.defaultItemGroup(cards, "status", CardsPage.CARD_STATUSES);
  }

  protected sortItems(cards: Card[]): Card[] {
    return this.defaultItemSort(cards, "cardId", "asc");
  }

  public goToDetailPage(card: Card) {
    this.navCtrl.push(CardsDetailsPage, { card });
  }
}
