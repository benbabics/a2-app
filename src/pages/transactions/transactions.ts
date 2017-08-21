import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector } from "@angular/core";
import { NavController, NavParams, SegmentButton } from "ionic-angular";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Session, TransactionList, DynamicList } from "../../models";
import { WexGreeking } from "../../components";
import { SessionCache, PostedTransactionRequestor, DynamicSessionListInfoRequestor } from "../../providers";
import { TransactionDetailsPage } from "./details/transaction-details";
import { Transaction, Driver, Card, Model } from "@angular-wex/models";
import { TransactionProvider, PostedTransactionSearchFilterBy } from "@angular-wex/api-providers";
import { TabPage } from "../../decorators/tab-page";
import { Value } from "../../decorators/value";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { NameUtils } from "../../utils/name-utils";

export type TransactionListModelType = Card | Driver | Transaction;
export type TransactionListModelTypeDetails = Card.Details | Driver.Details | Transaction.Details;

export type TransactionListType = keyof {
  Date,
  DriverName,
  CardNumber
};

export namespace TransactionListType {
  export const Date: TransactionListType = "Date";
  export const DriverName: TransactionListType = "DriverName";
  export const CardNumber: TransactionListType = "CardNumber";
}

export type TransactionListFilter = [PostedTransactionSearchFilterBy, any];

export interface TransactionsParams {
  selectedList?: TransactionListType;
  filter?: TransactionListFilter;
}

export type TransactionsParam = keyof TransactionsParams;

export namespace TransactionsParams {
  export const SelectedList: TransactionsParam = "selectedList";
  export const Filter: TransactionsParam = "filter";
}

export type AbstractTransactionsPageListView = TransactionsPageListView<TransactionListModelType, TransactionListModelTypeDetails>;
export type AbstractTransactionsPageListViewConstructor = { new(page: TransactionsPage): AbstractTransactionsPageListView };

export namespace FetchOptions {
  export const Defaults = StaticListPage.FetchOptions.Defaults;

  export const NextPage: StaticListPage.FetchOptions = Object.assign({}, Defaults, {
    forceRequest: true,
    clearItems: false,
    checkListSize: false
  });
}

//# TransactionsPageListView
// --------------------------------------------------
abstract class TransactionsPageListView<T extends Model<DetailsT>, DetailsT> {

  constructor(public readonly type: TransactionListType) { }

  public abstract get greekingData(): WexGreeking.Rect[];
  public abstract get listLabels(): string[];
  public abstract fetch(options?: StaticListPage.FetchOptions): Observable<T[]>;
  public abstract goToDetailPage(item: T): Promise<any>;
  public abstract sortItems(items: T[]): T[];

  public hasMoreItems(): boolean {
    return false;
  }
}

//# TransactionsPageDateView
// --------------------------------------------------
class TransactionsPageDateView extends TransactionsPageListView<Transaction, Transaction.Details> {

  constructor(protected transactionsPage: TransactionsPage) {
    super(TransactionListType.Date);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.DATE.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.DATE.listLabels;
  }

  public fetch(options?: StaticListPage.FetchOptions): Observable<Transaction[]> {
    if (options.clearItems && options.forceRequest && !!SessionCache.cachedValues.postedTransactionsInfo) {
      SessionCache.cachedValues.postedTransactionsInfo.details.currentPage = 0;
    }

    return this.transactionsPage.sessionManager.cache.getSessionDetail(Session.Field.PostedTransactions, options);
  }

  public goToDetailPage(item: Transaction): Promise<any> {
    return this.transactionsPage.navCtrl.push(TransactionDetailsPage, { item });
  }

  public hasMoreItems(): boolean {
    return this.transactionsPage.items.length < _.get(SessionCache.cachedValues, "postedTransactionsInfo.details.totalResults", 0);
  }

  public sortItems(objects: Transaction[]): Transaction[] {
    return StaticListPage.defaultItemSort<Transaction, Transaction.Details>(objects, "transactionDate", "desc");
  }
}

//# TransactionsPageDriverView
// --------------------------------------------------
class TransactionsPageDriverView extends TransactionsPageListView<Driver, Driver.Details> {

  constructor(protected transactionsPage: TransactionsPage) {
    super(TransactionListType.DriverName);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.DRIVER_NAME.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.DRIVER_NAME.listLabels;
  }

  public fetch(options?: StaticListPage.FetchOptions): Observable<Driver[]> {
    return this.transactionsPage.sessionManager.cache.getSessionDetail(Session.Field.Drivers, options);
  }

  public goToDetailPage(item: Driver): Promise<any> {
    return this.transactionsPage.navCtrl.push(TransactionsPage, {
      selectedList: TransactionListType.Date,
      filter: [PostedTransactionSearchFilterBy.Driver, item.details.promptId]
    });
  }

  public sortItems(objects: Driver[]): Driver[] {
    return StaticListPage.defaultItemSort<Driver, Driver.Details>(objects, "lastName", "asc");
  }
}

//# TransactionsPageCardView
// --------------------------------------------------
class TransactionsPageCardView extends TransactionsPageListView<Card, Card.Details> {

  constructor(protected transactionsPage: TransactionsPage) {
    super(TransactionListType.CardNumber);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.CARD_NUMBER.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.CARD_NUMBER.listLabels;
  }

  public fetch(options?: StaticListPage.FetchOptions): Observable<Card[]> {
    return this.transactionsPage.sessionManager.cache.getSessionDetail(Session.Field.Cards, options);
  }

  public goToDetailPage(item: Card): Promise<any> {
    return this.transactionsPage.navCtrl.push(TransactionsPage, {
      selectedList: TransactionListType.Date,
      filter: [PostedTransactionSearchFilterBy.Card, item.details.cardId]
    });
  }

  public sortItems(objects: Card[]): Card[] {
    return StaticListPage.defaultItemSort<Card, Card.Details>(objects, "cardId", "asc");
  }
}

//# TransactionsPageFilteredListView
// --------------------------------------------------
class TransactionsPageFilteredListView extends TransactionsPageDateView {

  private readonly transactionProvider: TransactionProvider;
  private transactions: TransactionList;
  private requestor: DynamicSessionListInfoRequestor<Transaction, Transaction.Details>;

  constructor(protected transactionsPage: TransactionsPage, private filterType: PostedTransactionSearchFilterBy, private filterValue: string) {
    super(transactionsPage);

    this.transactionProvider = this.transactionsPage.injector.get(TransactionProvider);
    this.transactions = DynamicList.create(Transaction);
    this.requestor = new PostedTransactionRequestor(this.transactionProvider, this.transactions);
  }

  public get fetchedItems(): Transaction[] {
    return this.transactions.items;
  }

  public get totalResults(): number {
    return this.transactions.details.totalResults;
  }

  public fetch(options?: StaticListPage.FetchOptions): Observable<Transaction[]> {
    let doRequest = options.clearCache || options.forceRequest || !this.transactions.items;

    if (options.clearCache) {
      this.transactions.clear();
    }

    if (doRequest) {
      return this.requestor.request(this.transactionsPage.session, {
        filterBy: this.filterType,
        filterValue: this.filterValue
      }).map(response => response.items);
    }
    else {
      return Observable.of(this.transactions.items);
    }
  }

  public hasMoreItems(): boolean {
    return _.isNil(this.totalResults) || _.isNil(this.fetchedItems) || (this.fetchedItems.length < this.totalResults);
  }
}

//# TransactionsPage
// --------------------------------------------------
@TabPage()
@Component({
  selector: "page-transactions",
  templateUrl: "transactions.html"
})
export class TransactionsPage extends StaticListPage<TransactionListModelType, TransactionListModelTypeDetails> {
  @Value("STORAGE.KEYS.LAST_TRANSACTION_VIEW") private readonly LAST_TRANSACTION_VIEW_KEY: string;

  private static readonly ListViews: Map<TransactionListType, AbstractTransactionsPageListViewConstructor> = (() => {
    let listView = new Map();

    listView.set(TransactionListType.Date, TransactionsPageDateView);
    listView.set(TransactionListType.CardNumber, TransactionsPageCardView);
    listView.set(TransactionListType.DriverName, TransactionsPageDriverView);

    return listView;
  })();

  public readonly filter: TransactionListFilter;
  public selectedListView: AbstractTransactionsPageListView;
  public session: Session;

  constructor(private localStorageService: LocalStorageService, public navCtrl: NavController, public navParams: NavParams, public injector: Injector) {
    super("Transactions", injector);

    this.listGroupDisplayOrder = [];
    this.filter = this.navParams.get(TransactionsParams.Filter);
  }

  private calculateLabelGroupByDate(date: Date): string {
    let offsetDays: number = moment().diff(date, "days");
    let $moment: moment.Moment = moment(date).subtract(offsetDays);

    if (offsetDays === 0) {
      return "Today";
    }
    else if (offsetDays === 1) {
      return "Yesterday";
    }
    else if (offsetDays < 30) {
      return $moment.format("MM/DD/YYYY");
    }
    else if (offsetDays < 360) {
      return $moment.format("MMMM YYYY");
    }
    else {
      return $moment.format("YYYY");
    }
  }

  private calculateDateByLabelGroup(labelGroup: string): Date {
    if (labelGroup === "Today") {
      return new Date();
    }
    else if (labelGroup === "Yesterday") {
      return moment().subtract(1, "days").toDate();
    }
    else if (/^\d{2}\/\d{2}\/\d{4,}$/.test(labelGroup)) {
      return moment(labelGroup, "MM/DD/YYYY").toDate();
    }
    else if (/^\D+ \d{4,}$/.test(labelGroup)) {
      return moment(labelGroup, "MMMM YYYY").toDate();
    }
    else if (/^\d{4,}$/.test(labelGroup)) {
      return moment(labelGroup, "YYYY").toDate();
    }

    return null;
  }


  private selectList(listType: TransactionListType) {
    if (this.selectedListView && this.selectedListView.type === listType) {
      return this.selectedListView;
    }

    // Choose the correct list view implementation
    if (this.filter) {
      this.selectedListView = new TransactionsPageFilteredListView(this, this.filterBy, this.filterValue);
    }
    else {
      const listViewType = TransactionsPage.ListViews.get(listType);

      if (!listViewType) {
        return console.error("Can't select list; Unrecognized TransactionListType");
      }

      this.selectedListView = new listViewType(this);
    }

    // Re-render the list
    this.fetchResults().subscribe();
  }

  protected fetch(options?: StaticListPage.FetchOptions): Observable<any[]> {
    return this.selectedListView.fetch(options);
  }

  protected groupItems(transactions: Transaction[]): GroupedList<Transaction> {
    // Group the transactions by date
    let groupedList = transactions.reduce<GroupedList<Transaction>>((groupedList, transaction) => {
      // Get the correct group for this transaction
      let group = this.calculateLabelGroupByDate(transaction.postDate);
      // Get the list for this group
      let transactionList = groupedList[group] = groupedList[group] || [];
      // Add the transaction to the list
      transactionList.push(transaction);

      return groupedList;
    }, {});

    // Calculate the list group display order
    this.listGroupDisplayOrder = _.keys(groupedList).sort((groupA, groupB) => {
      return moment(this.calculateDateByLabelGroup(groupA)).isAfter(this.calculateDateByLabelGroup(groupB)) ? -1 : 1;
    });

    return groupedList;
  }

  protected sortItems(items: TransactionListModelType[]): TransactionListModelType[] {
    return this.selectedListView.sortItems(items);
  }

  public get dividerLabels(): string[] {
    return this.isGrouped ? this.listGroupDisplayOrder : undefined;
  }

  public get filterBy(): PostedTransactionSearchFilterBy {
    return this.filter ? this.filter[0] : undefined;
  }

  public get filterValue(): any {
    return this.filter ? this.filter[1] : undefined;
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.selectedListView.greekingData;
  }

  public set greekingData(data) { data; }

  public get hasMoreItems(): boolean {
    return this.selectedListView.hasMoreItems();
  }

  public get isCardView(): boolean {
    return this.selectedListView.type === TransactionListType.CardNumber;
  }

  public get isDateView(): boolean {
    return this.selectedListView.type === TransactionListType.Date;
  }

  public get isDriverView(): boolean {
    return this.selectedListView.type === TransactionListType.DriverName;
  }

  public get isGrouped(): boolean {
    return this.isDateView;
  }

  public get isListSelectionLocked(): boolean {
    // If a selected list was passed as a nav param, lock the display to the given list
    return this.navParams.get(TransactionsParams.SelectedList);
  }

  public get listLabels(): string[] {
    return this.selectedListView.listLabels;
  }

  public set listLabels(listLabels) { listLabels; }

  public goToDetailPage(item: TransactionListModelType) {
    return this.selectedListView.goToDetailPage(item);
  }

  public listDisplayName(item: Driver): string {
    return NameUtils.DelimitedPrintableName(", ", item.details.lastName, item.details.firstName);
  }

  public onSelectList(selection: SegmentButton) {
    this.localStorageService.set(this.LAST_TRANSACTION_VIEW_KEY, selection.value);
    this.selectList(selection.value as TransactionListType);
  }

  public onInfinite(event: any): Promise<TransactionListModelType> {
    return this.fetchResults(FetchOptions.NextPage)
      .toPromise()
      .then(() => event.complete());
  }

  public ionViewCanEnter(): Promise<any> {
    return super.ionViewCanEnter().then(() => {
      let transactionListType: TransactionListType;

      if (!this.filter) {
        transactionListType = this.localStorageService.get<TransactionListType>(this.LAST_TRANSACTION_VIEW_KEY);
      }

      this.selectList(transactionListType || TransactionListType.Date);
    });
  }
}
