import * as _ from "lodash";
import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController, CardProvider } from "../../providers";
import { ListPage, GroupedList } from "../list-page";
import { Card, CardStatus } from "../../models";

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends ListPage {

  private static readonly CARD_STATUSES: CardStatus[] = CardStatus.values();
  private static readonly SEARCH_FILTER_FIELDS: (keyof Card)[] = [
    "embossingValue1",
    "embossingValue2",
    "cardId"
  ];

  private sortedCardGroups: any = {};

  public readonly dividerLabels: string[] = CardsPage.CARD_STATUSES.map(CardStatus.displayName);
  public cards: Card[] = [];
  public fetchingCards: boolean = false;
  public searchFilter: string = "";

  constructor(public navCtrl: WexNavController, public navParams: NavParams, private cardProvider: CardProvider) {
    super("Cards");
  }

  public get activeCards(): Card[] {
    return this.sortedCardGroups[CardStatus.ACTIVE];
  }

  public get suspendedCards(): Card[] {
    return this.sortedCardGroups[CardStatus.SUSPENDED];
  }

  public get terminatedCards(): Card[] {
    return this.sortedCardGroups[CardStatus.TERMINATED];
  }

  public get sortedCards(): Card[][] {
    return [this.activeCards, this.suspendedCards, this.terminatedCards];
  }

  private groupCards(cards: Card[]): GroupedList<Card> {
    return this.groupBy(cards, "status", CardsPage.CARD_STATUSES);
  }

  private sortCards(cards: Card[]): Card[] {
    return this.sortList(cards, "cardId", "asc");
  }

  private sortCardGroups(groupedCards: GroupedList<Card>): GroupedList<Card> {
    return _.transform(groupedCards, (sortedGroups: GroupedList<Card>, cards: Card[], cardStatus: CardStatus) => {
      //sort each grouped list individually
      return sortedGroups[cardStatus] = this.sortCards(cards);
    }, {});
  }

  ionViewWillEnter() {
    this.fetchingCards = true;

    this.cardProvider.search(this.session.user.company.accountId)
      .finally(() => this.fetchingCards = false)
      .subscribe((cards: Card[]) => {
        this.cards = cards;

        this.updateList();
      });
  }

  public updateList() {
    //do a case-insensitive search
    let searchRegex = new RegExp(_.escapeRegExp(this.searchFilter), "i");

    let filteredCards = this.cards.filter((card) => CardsPage.SEARCH_FILTER_FIELDS.some((searchField) => {
      return String(card[searchField]).search(searchRegex) !== -1;
    }));

    this.sortedCardGroups = this.sortCardGroups(this.groupCards(filteredCards));
  }
}
