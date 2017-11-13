import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector } from "@angular/core";
import { NavController, NavParams, SegmentButton } from "ionic-angular";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Session, PostedTransactionList, DynamicList } from "../../models";
import { WexGreeking } from "../../components";
import { SessionCache, PostedTransactionRequestor, DynamicSessionListInfoRequestor, SessionInfoRequestors, WexAppBackButtonController, SessionInfoOptions } from "../../providers";
import { TransactionDetailsPage } from "./details/transaction-details";
import { BaseTransaction, PostedTransaction, Driver, Card, Model, PendingTransaction } from "@angular-wex/models";
import { TransactionProvider, TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { TabPage } from "../../decorators/tab-page";
import { Value } from "../../decorators/value";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { NameUtils } from "../../utils/name-utils";
import { Reactive } from "angular-rxjs-extensions";

export type BaseTransactionT = BaseTransaction<BaseTransaction.Details>;
export type TransactionListModelType = Card | Driver | BaseTransactionT;
export type TransactionListModelTypeDetails = Card.Details | Driver.Details | BaseTransaction.Details;

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

export type TransactionListFilter = [TransactionSearchFilterBy, any];

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

//# TransactionsPageListView
// --------------------------------------------------
abstract class TransactionsPageListView<T extends Model<DetailsT>, DetailsT> {

  constructor(public readonly type: TransactionListType, public readonly field: Session.Field) { }

  public abstract get greekingData(): WexGreeking.Rect[];
  public abstract get listLabels(): string[];
  public abstract goToDetailPage(item: T): Promise<any>;
  public abstract sortItems(items: T[]): T[];

  public fetch?(options?: SessionInfoOptions): Observable<T[]>;

  public get hasMoreItems$(): Observable<boolean> {
    return Observable.of(false);
  }
}

//# TransactionsPageDateView
// --------------------------------------------------
class TransactionsPageDateView extends TransactionsPageListView<BaseTransactionT, BaseTransaction.Details> {

  constructor(protected transactionsPage: TransactionsPage) {
    super(TransactionListType.Date, undefined);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.DATE.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.DATE.listLabels;
  }

  public fetch(options?: SessionInfoOptions): Observable<BaseTransactionT[]> {
    return Observable.forkJoin([
      this.fetchPending(options),
      this.fetchPosted(options)
    ]).map((...values: any[]): BaseTransactionT[] => {
      let transactions: [BaseTransactionT[], BaseTransactionT[]] = values[0];
      let pendingTransactions = _.first(transactions) || [];
      let postedTransactions = _.last(transactions) || [];
      // Concat the pending and posted transactions together
      return pendingTransactions.concat(postedTransactions);
    });
  }

  public goToDetailPage(item: BaseTransactionT): Promise<any> {
    if (item instanceof PostedTransaction) {
      return this.transactionsPage.navCtrl.push(TransactionDetailsPage, { item });
    }
  }

  public get hasMoreItems$(): Observable<boolean> {
    return this.transactionsPage.sessionCache.getField$<PostedTransactionList>(Session.Field.PostedTransactionsInfo)
      .map(info => info.details.totalResults > 0);
  }

  public sortItems(objects: BaseTransactionT[]): BaseTransactionT[] {
    return StaticListPage.sortList<BaseTransactionT>(objects, "effectiveDate", "desc");
  }

  protected fetchPending(options?: SessionInfoOptions): Observable<PendingTransaction[]> {
    // Only re-fetch the pending transactions if we're clearing the cache as there is only a single page of pending transactions
    options = _.clone(options);

    return (function () {
      if (options.clearCache) {
        return this.transactionsPage.sessionCache.update$(Session.Field.PendingTransactions, options);
      }
      else {
        return this.transactionsPage.sessionCache.require$(Session.Field.PendingTransactions);
      }
    })().map(session => session.pendingTransactions);
  }

  protected fetchPosted(options?: SessionInfoOptions): Observable<PostedTransaction[]> {
    return (function () {
      if (options.clearCache) {
        return Observable.if(() => options.clearCache,
          this.transactionsPage.sessionCache.getSessionField$(Session.Field.PostedTransactionsInfo)
            .take(1)
            .map(info => info.details.currentPage = 0),
          Observable.empty())
          .flatMap(() => this.transactionsPage.sessionCache.update$(Session.Field.PostedTransactions, options));
      }
      else {
        return this.transactionsPage.sessionCache.require$(Session.Field.PostedTransactions);
      }
    })().map(session => session.postedTransactions);
  }
}

//# TransactionsPageDriverView
// --------------------------------------------------
class TransactionsPageDriverView extends TransactionsPageListView<Driver, Driver.Details> {

  constructor(protected transactionsPage: TransactionsPage) {
    super(TransactionListType.DriverName, Session.Field.Drivers);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.DRIVER_NAME.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.DRIVER_NAME.listLabels;
  }

  public goToDetailPage(item: Driver): Promise<any> {
    return this.transactionsPage.navCtrl.push(TransactionsPage, {
      selectedList: TransactionListType.Date,
      filter: [TransactionSearchFilterBy.Driver, item.details.promptId]
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
    super(TransactionListType.CardNumber, Session.Field.Cards);
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.transactionsPage.CONSTANTS.CARD_NUMBER.greekingData;
  }

  public get listLabels(): string[] {
    return this.transactionsPage.CONSTANTS.CARD_NUMBER.listLabels;
  }

  public goToDetailPage(item: Card): Promise<any> {
    return this.transactionsPage.navCtrl.push(TransactionsPage, {
      selectedList: TransactionListType.Date,
      filter: [TransactionSearchFilterBy.Card, item.details.cardId]
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
  private readonly requestors: SessionInfoRequestors;
  private pendingTransactions: PendingTransaction[];
  private postedTransactions: PostedTransactionList;
  private postedRequestor: DynamicSessionListInfoRequestor<PostedTransaction, PostedTransaction.Details>;

  constructor(protected transactionsPage: TransactionsPage, private filterType: TransactionSearchFilterBy, private filterValue: string) {
    super(transactionsPage);

    this.transactionProvider = this.transactionsPage.injector.get(TransactionProvider);
    this.requestors = this.transactionsPage.injector.get(SessionInfoRequestors);
    this.pendingTransactions = [];
    this.postedTransactions = DynamicList.create(PostedTransaction);
    this.postedRequestor = new PostedTransactionRequestor(this.transactionProvider, this.postedTransactions);
  }

  public get hasMoreItems$(): Observable<boolean> {
    return Observable.of(_.isNil(this.totalResultsPosted)
      || _.isNil(this.fetchedPostedItems) || this.fetchedPostedItems.length < this.totalResultsPosted);
  }

  protected fetchPosted(options?: SessionInfoOptions): Observable<PostedTransaction[]> {
    let doRequest = options.clearCache || !this.postedTransactions.items;

    if (options.clearCache) {
      this.postedTransactions.clear();
    }

    if (doRequest) {
      return this.postedRequestor.request(this.transactionsPage.session, {
        filterBy: this.filterType,
        filterValue: this.filterValue
      }).map(response => response.items);
    }
    else {
      return Observable.of(this.postedTransactions.items);
    }
  }

  protected fetchPending(options?: SessionInfoOptions): Observable<PendingTransaction[]> {
    let doRequest = options.clearCache || !this.pendingTransactions;

    if (options.clearCache) {
      this.pendingTransactions = [];
    }

    if (doRequest) {
      return this.requestors.getRequestor(Session.Field.PendingTransactions).requestor(this.transactionsPage.session, {
        filterBy: this.filterType,
        filterValue: this.filterValue
      }).map((response: PendingTransaction[]) => this.pendingTransactions = response);
    }
    else {
      return Observable.of(this.pendingTransactions);
    }
  }

  private get fetchedPostedItems(): PostedTransaction[] {
    return this.postedTransactions.items;
  }

  private get totalResultsPosted(): number {
    return this.postedTransactions.details.totalResults;
  }
}

//# TransactionsPage
// --------------------------------------------------
@Component({
  selector: "page-transactions",
  templateUrl: "transactions.html"
})
@Reactive()
@TabPage()
export class TransactionsPage extends StaticListPage<TransactionListModelType, TransactionListModelTypeDetails> {
  @Value("STORAGE.KEYS.LAST_TRANSACTION_VIEW") private readonly LAST_TRANSACTION_VIEW_KEY: string;

  private static readonly ListViews: Map<TransactionListType, AbstractTransactionsPageListViewConstructor> = (() => {
    let listView = new Map();

    listView.set(TransactionListType.Date, TransactionsPageDateView);
    listView.set(TransactionListType.CardNumber, TransactionsPageCardView);
    listView.set(TransactionListType.DriverName, TransactionsPageDriverView);

    return listView;
  })();

  //@StateEmitter() private hasMoreItems$: Subject<boolean>;

  public readonly filter: TransactionListFilter;
  public selectedListView: AbstractTransactionsPageListView;
  public session: Session;
  public sessionCache: SessionCache;

  constructor(private localStorageService: LocalStorageService, public navCtrl: NavController, public navParams: NavParams, public injector: Injector, private wexAppBackButtonController: WexAppBackButtonController) {
    super("Transactions", undefined, injector);

    this.listGroupDisplayOrder = [];
    this.filter = this.navParams.get(TransactionsParams.Filter);
  }

  private calculateLabelGroupByDate(date: Date): string {
    let $moment: moment.Moment = moment(date).startOf("day");
    let offsetDays: number = moment().startOf("day").diff(date, "days");

    $moment = $moment.subtract(offsetDays);

    if (offsetDays === 0) {
      return this.CONSTANTS.LABELS.today;
    }
    else if (offsetDays === 1) {
      return this.CONSTANTS.LABELS.yesterday;
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
    if (labelGroup === this.CONSTANTS.LABELS.pending) {
      return moment().endOf("day").toDate();
    }
    else if (labelGroup === this.CONSTANTS.LABELS.today) {
      return moment().startOf("day").toDate();
    }
    else if (labelGroup === this.CONSTANTS.LABELS.yesterday) {
      return moment().startOf("day").subtract(1, "days").toDate();
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

      this.listDataField = this.selectedListView.field;
    }

    // Re-render the list
    this.updateList();
  }

  /*protected fetch(options?: StaticListPage.FetchOptions): Observable<any[]> {
    let fetch = (() => {
      if (this.selectedListView.fetch) {
        return this.selectedListView.fetch(options);
      }
      else {
        this.listDataField = this.selectedListView.field;
        return super.fetch(options);
      }
    })();

    fetch
      .flatMap(() => this.selectedListView.hasMoreItems$)
      .map(hasMoreItems => this.hasMoreItems$.next(hasMoreItems))
      .subscribe();
    return fetch;
  }*/

  protected groupItems(transactions: BaseTransactionT[]): GroupedList<BaseTransactionT> {
    let group: string;
    let groupedList = transactions.reduce<GroupedList<BaseTransactionT>>((groupedList, transaction) => {
      // Group transactions
      if (transaction instanceof PendingTransaction) {
        group = this.CONSTANTS.LABELS.pending;
      }
      else {
        group = this.calculateLabelGroupByDate(transaction.effectiveDate);
      }

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

  public get filterBy(): TransactionSearchFilterBy {
    return this.filter ? this.filter[0] : undefined;
  }

  public get filterValue(): any {
    return this.filter ? this.filter[1] : undefined;
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.selectedListView.greekingData;
  }

  public set greekingData(data) { data; }

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

  public getTransactionAmount(transaction: BaseTransactionT): number {
    if (transaction instanceof PendingTransaction) {
      return transaction.details.authorizationAmount;
    }
    else if (transaction instanceof PostedTransaction) {
      return transaction.details.netCost;
    }

    return 0;
  }

  public goToDetailPage(item: TransactionListModelType) {
    return this.selectedListView.goToDetailPage(item);
  }

  public isItemActive(item: TransactionListModelType): boolean {
    return !(item instanceof PendingTransaction);
  }

  public listDisplayName(item: Driver): string {
    return NameUtils.DelimitedPrintableName(", ", item.details.lastName, item.details.firstName);
  }

  public onSelectList(selection: SegmentButton) {
    this.localStorageService.set(this.LAST_TRANSACTION_VIEW_KEY, selection.value);
    this.selectList(selection.value as TransactionListType);
  }

  public onInfinite(event: any): Promise<TransactionListModelType> {
    return this.sessionCache.update$(this.listDataField)
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

  public ionViewDidEnter() {
    if (this.filter) {
      this.wexAppBackButtonController.deregisterAction();
    }
  }
}
