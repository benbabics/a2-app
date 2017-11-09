import { Observable } from "rxjs";
import { CardsDetailsPage } from "./details/cards-details";
import { Component, Injector, DoCheck } from "@angular/core";
import { NavParams, NavController, Events, App } from "ionic-angular";
import { StaticListPage, GroupedList, FetchOptions } from "../static-list-page";
import { Card, CardStatus } from "@angular-wex/models";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { TransactionsPage } from "../transactions/transactions";
import { TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { TransactionDateSublist } from "../transactions/transactions-date-view/transactions-date-view";

@TabPage()
@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends StaticListPage<Card, Card.Details> {

  private static readonly CARD_STATUSES: CardStatus[] = [CardStatus.ACTIVE, CardStatus.SUSPENDED, CardStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Card.Field[] = [
    "embossingValue1",
    "embossingValue2",
    "embossedCardNumber"
  ];

  protected readonly listGroupDisplayOrder: string[] = CardsPage.CARD_STATUSES;
  public readonly dividerLabels: string[] = CardsPage.CARD_STATUSES.map(CardStatus.displayName);
  public readonly contentOnly: boolean = false;

  public constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    protected app: App,
    events: Events,
    injector: Injector
  ) {
    super("Cards", injector, CardsPage.SEARCH_FILTER_FIELDS);

    events.subscribe("cards:statusUpdate", () => this.updateList());
  }

  protected fetch(options?: FetchOptions): Observable<Card[]> {
    return this.sessionCache.getSessionDetail(Session.Field.Cards, options);
  }

  protected groupItems(cards: Card[]): GroupedList<Card> {
    return StaticListPage.defaultItemGroup<Card, Card.Details>(cards, "status", CardsPage.CARD_STATUSES);
  }

  protected sortItems(cards: Card[]): Card[] {
    return StaticListPage.defaultItemSort<Card, Card.Details>(cards, "cardId", "asc");
  }

  public goToDetailPage(card: Card) {
    this.navCtrl.push(CardsDetailsPage, { card });
  }
}

export class TransactionCardView extends CardsPage implements DoCheck {
  public readonly contentOnly: boolean = true;
  private heightHasBeenSet: boolean;

  public ngDoCheck() {
    this.heightHasBeenSet = TransactionsPage.ResizeContentForTransactionHeader(this.content, this.heightHasBeenSet);
  }

  public goToDetailPage(item: Card): Promise<any> {
    return this.navCtrl.parent.push(TransactionDateSublist, {
      filter: [TransactionSearchFilterBy.Card, item.details.cardId ]
    });
  }
}