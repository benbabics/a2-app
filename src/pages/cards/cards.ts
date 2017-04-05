import * as _ from "lodash";
import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController, CardProvider } from "../../providers";
import { SecurePage } from "../secure-page";
import { Card } from "../../models";

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends SecurePage {

  private static readonly SEARCH_FILTER_FIELDS: (keyof Card)[] = [
    "embossingValue1",
    "embossingValue2",
    "cardId"
  ];

  public cards: Card[] = [];
  public filteredCards: Card[] = [];
  public fetchingCards: boolean = false;
  public searchFilter: string = "";

  constructor(public navCtrl: WexNavController, public navParams: NavParams, private cardProvider: CardProvider) {
    super("Cards");
  }

  ionViewWillEnter() {
    this.fetchingCards = true;

    this.cardProvider.search(this.session.user.company.accountId)
      .finally(() => this.fetchingCards = false)
      .subscribe((cards: Card[]) => {
        this.filteredCards = this.cards = cards;

        if (this.searchFilter) {
          this.updateList();
        }
      });
  }

  public updateList() {
    //do a case-insensitive search
    let searchRegex = new RegExp(_.escapeRegExp(this.searchFilter), "i");

    this.filteredCards = this.cards.filter((card) => CardsPage.SEARCH_FILTER_FIELDS.some((searchField) => {
      return String(card[searchField]).search(searchRegex) !== -1;
    }));
  }
}
