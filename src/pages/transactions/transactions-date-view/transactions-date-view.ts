import { TransactionsPage } from "../transactions";
import { BaseTransaction, PendingTransaction, PostedTransaction } from "@angular-wex/models";
import { StaticListPage } from "../../static-list-page";
import * as moment from "moment";
import { Component, Injector, DoCheck } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Session, PostedTransactionList } from "../../../models/session";
import { SessionCache } from "../../../providers/session-cache";
import * as _ from "lodash";
import { TransactionSearchFilterBy, TransactionProvider } from "@angular-wex/api-providers";
import { Observable } from "rxjs";
import { TransactionDetailsPage } from "../details/transaction-details";
import { GroupedList } from "../../list-page";
import { WexGreeking } from "../../../components/index";
import { SessionInfoRequestors } from "../../../providers/session-info-requestor/session-info-requestor";
import { DynamicList } from "../../../models/index";
import { PostedTransactionRequestor } from "../../../providers/index";

export type TransactionDateViewParams = keyof {
  filter?: TransactionListFilter;
};

export namespace TransactionDateViewParams {
  export const Filter: TransactionDateViewParams = "filter";
}

export namespace FetchOptions {
  export const Defaults = StaticListPage.FetchOptions.Defaults;

  export const NextPage: StaticListPage.FetchOptions = Object.assign({}, Defaults, {
    forceRequest: true,
    clearItems: false,
    checkListSize: false
  });
}

export type TransactionListFilter = [TransactionSearchFilterBy, any];
export type BaseTransactionT = BaseTransaction<BaseTransaction.Details>;

@Component({
  selector: "transactions-date-view",
  templateUrl: "transactions-date-view.html"
})
export class TransactionDateSublist extends StaticListPage<BaseTransactionT, BaseTransaction.Details> {
  public readonly filter: TransactionListFilter;
  public session: Session;
  public sessionCache: SessionCache;
  private pendingTransactions: PendingTransaction[] = [];
  private postedTransactions: PostedTransactionList = DynamicList.create(PostedTransaction);
  private postedRequestor = new PostedTransactionRequestor(this.transactionProvider, this.postedTransactions);

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public injector: Injector,
    protected requestors: SessionInfoRequestors,
    protected transactionProvider: TransactionProvider) {
    super("Transactions.Date", injector);

    this.listGroupDisplayOrder = [];
    this.filter = this.navParams.get(TransactionDateViewParams.Filter);
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

  public fetch(options?: StaticListPage.FetchOptions): Observable<BaseTransactionT[]> {
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

  protected fetchPending(options?: StaticListPage.FetchOptions): Observable<PendingTransaction[]> {
    let doRequest = options.clearCache || options.forceRequest || !this.pendingTransactions;

    if (options.clearCache) {
      this.pendingTransactions = [];
    }

    if (doRequest) {
      return this.requestors.getRequestor(Session.Field.PendingTransactions).requestor(this.session, {
        filterBy: this.filter[0],
        filterValue: this.filter[1]
      }).map((response: PendingTransaction[]) => this.pendingTransactions = response);
    }
    else {
      return Observable.of(this.pendingTransactions);
    }
  }

  protected fetchPosted(options?: StaticListPage.FetchOptions): Observable<PostedTransaction[]> {
    let doRequest = options.clearCache || options.forceRequest || !this.postedTransactions.items;

    if (options.clearCache) {
      this.postedTransactions.clear();
    }

    if (doRequest) {
      return this.postedRequestor.request(this.session, {
        filterBy: this.filter[0],
        filterValue: this.filter[1]
      }).map(response => response.items);
    }
    else {
      return Observable.of(this.postedTransactions.items);
    }
  }

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

  public sortItems(objects: BaseTransactionT[]): BaseTransactionT[] {
    return StaticListPage.sortList<BaseTransactionT>(objects, "effectiveDate", "desc");
  }

  public get dividerLabels(): string[] {
    return this.listGroupDisplayOrder;
  }

  public get filterBy(): TransactionSearchFilterBy {
    return this.filter ? this.filter[0] : undefined;
  }

  public get filterValue(): any {
    return this.filter ? this.filter[1] : undefined;
  }

  public get greekingData(): WexGreeking.Rect[] {
    return this.CONSTANTS.greekingData;
  }

  public set greekingData(data) { data; }

  public hasMoreItems(): boolean {
    return this.items.length < _.get(SessionCache.cachedValues, "postedTransactionsInfo.details.totalResults", 0);
  }

  public get isGrouped(): boolean {
    return true;
  }

  public set isGrouped(isGrouped: boolean) { isGrouped; }


  public get listLabels(): string[] {
    return this.CONSTANTS.listLabels;
  }

  public set listLabels(listLabels) { listLabels; }

  public goToDetailPage(item: BaseTransactionT): Promise<any> {
    if (item instanceof PostedTransaction) {
      return this.navCtrl.push(TransactionDetailsPage, { item });
    }
  }

  public isItemActive(item: BaseTransactionT): boolean {
    return !(item instanceof PendingTransaction);
  }

  public onInfinite(event: any): Promise<BaseTransactionT[]> {
    return this.fetchResults(FetchOptions.NextPage)
      .toPromise()
      .then(() => event.complete());
  }
}

export class TransactionDateView extends TransactionDateSublist implements DoCheck {
  private heightHasBeenSet: boolean;
  public readonly contentOnly: boolean = true;

  protected fetchPending(options?: StaticListPage.FetchOptions): Observable<PendingTransaction[]> {
    // Only re-fetch the pending transactions if we're clearing the cache as there is only a single page of pending transactions
    options = _.clone(options);
    options.forceRequest = options.forceRequest && options.clearItems;

    return this.sessionCache.getSessionDetail(Session.Field.PendingTransactions, options);
  }

  protected fetchPosted(options?: StaticListPage.FetchOptions): Observable<PostedTransaction[]> {
    if (options.clearItems && options.forceRequest && !!SessionCache.cachedValues.postedTransactionsInfo) {
      SessionCache.cachedValues.postedTransactionsInfo.details.currentPage = 0;
    }

    return this.sessionCache.getSessionDetail(Session.Field.PostedTransactions, options);
  }

  public ngDoCheck() {
    this.heightHasBeenSet = TransactionsPage.ResizeContentForTransactionHeader(this.content, this.heightHasBeenSet);
  }

  public goToDetailPage(item: BaseTransactionT): Promise<any> {
    if (item instanceof PostedTransaction) {
      return this.navCtrl.parent.push(TransactionDetailsPage, { item });
    }
  }
}