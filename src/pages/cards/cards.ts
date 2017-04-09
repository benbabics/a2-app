import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController, CardProvider } from "../../providers";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Card, CardStatus } from "../../models";
import { WexGreeking } from "../../components";

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends StaticListPage<Card, Card.Details> {

  private static readonly CARD_STATUSES: CardStatus[] = CardStatus.values();
  private static readonly SEARCH_FILTER_FIELDS: Card.Field[] = [
    "embossingValue1",
    "embossingValue2",
    "cardId"
  ];

  public readonly dividerLabels: string[] = CardsPage.CARD_STATUSES.map(CardStatus.displayName);

  constructor(public navCtrl: WexNavController, public navParams: NavParams, private cardProvider: CardProvider) {
    super("Cards", CardsPage.SEARCH_FILTER_FIELDS);
  }

  public get activeCards(): Card[] {
    return this.sortedItemGroups[CardStatus.ACTIVE];
  }

  public get suspendedCards(): Card[] {
    return this.sortedItemGroups[CardStatus.SUSPENDED];
  }

  public get terminatedCards(): Card[] {
    return this.sortedItemGroups[CardStatus.TERMINATED];
  }

  public get sortedItemLists(): Card[][] {
    return [this.activeCards, this.suspendedCards, this.terminatedCards];
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
}
