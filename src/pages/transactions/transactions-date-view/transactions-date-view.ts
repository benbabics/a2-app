import { BaseTransaction, PendingTransaction, PostedTransaction, Card, Driver } from "@angular-wex/models";
import { StaticListPage } from "../../static-list-page";
import * as moment from "moment";
import { Component, Injector } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Session, PostedTransactionList } from "../../../models/session";
import * as _ from "lodash";
import { TransactionSearchFilterBy, TransactionSearchOptions } from "@angular-wex/api-providers";
import { TransactionDetailsPage } from "../details/transaction-details";
import { GroupedList } from "../../list-page";
import { TabPage } from "../../../decorators/tab-page";
import { WexCardNumberPipe } from "../../../pipes/index";
import { NameUtils } from "../../../utils/name-utils";
import { Reactive, StateEmitter, EventSource, OnDestroy } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";

export type TransactionsDateViewParams = keyof {
  filterItem
};

export namespace TransactionsDateViewParams {

  export const FilterItem: TransactionsDateViewParams = "filterItem";
}

export type BaseTransactionT = BaseTransaction<BaseTransaction.Details>;

@Component({
  selector: "transactions-date-view",
  templateUrl: "transactions-date-view.html"
})
@Reactive()
@TabPage()
export class TransactionsDateView extends StaticListPage<BaseTransactionT, BaseTransaction.Details> {

  public readonly params: StaticListPage.Params<BaseTransaction.Details> & { listData: Session.Field[] };

  @EventSource() private onInfinite$: Observable<any>;
  @OnDestroy() private onDestroy$: Observable<any>;

  @StateEmitter() private hasMoreItems$: Subject<boolean>;
  @StateEmitter() private filterSubheader$: Subject<string>;
  @StateEmitter() private filteredMode$: Subject<boolean>;

  constructor(navCtrl: NavController, navParams: NavParams, injector: Injector) {
    const filterItem = navParams.get(TransactionsDateViewParams.FilterItem);
    const filter = filterItem ? TransactionsDateView.CreateFilterParams(filterItem) : undefined;
    // Use different session data depending on whether or not we're filtering transactions
    const listDataFields = filter ?
      [
        Session.Field.FilteredPendingTransactions,
        Session.Field.FilteredPostedTransactions
      ] :
      [
        Session.Field.PendingTransactions,
        Session.Field.PostedTransactions
      ];
    const postedTransactionsInfoField = filter ? Session.Field.FilteredPostedTransactionsInfo : Session.Field.PostedTransactionsInfo;

    super({
      pageName: "Transactions.Date",
      listData: listDataFields,
      listDataRequestParams: filter,
      dividerLabels: [] // Enable grouping
    }, injector);

    if (filter) {
      if (filterItem instanceof Card) {
        this.params.trackingName = "TransactionCard";
        this.filterSubheader$.next(new WexCardNumberPipe().transform(filterItem.details.embossedCardNumber));
      }

      if (filterItem instanceof Driver) {
        this.params.trackingName = "TransactionDriver";
        this.filterSubheader$.next(NameUtils.PrintableName(filterItem.details.firstName, filterItem.details.lastName));
      }

      // Request the filtered transaction data
      const updateSubscription = this.sessionCache.updateSome$(this.params.listData, {
        clearCache: true,
        requestParams: filter
      }).subscribe();

      // Cancel the subscription if the page is destroyed
      this.onDestroy$.subscribe(() => updateSubscription.unsubscribe());
    }
    else {
      // Don't track page view if this is a non-filtered list
      this.params.trackView = false;
    }

    this.filteredMode$.next(!!filter);

    // Calculate if there are more items to fetch
    this.fetchedItems$
      .flatMap((fetchedItems) => {
        return this.sessionCache.getField$<PostedTransactionList>(postedTransactionsInfoField).take(1)
          .filter(Boolean)
          .map(postedTransactionsInfo => [fetchedItems, postedTransactionsInfo]);
      })
      .subscribe((args: [[PendingTransaction[], PostedTransaction[]], PostedTransactionList]) => {
        const [[, postedTransactions], postedTransactionsInfo] = args;
        this.hasMoreItems$.next(postedTransactions.length < postedTransactionsInfo.details.totalResults);
      });

    this.onItemSelected$
      .filter(item => item instanceof PostedTransaction)
      .withLatestFrom(this.filteredMode$)
      .map((args): [NavController, BaseTransactionT] => {
        const [item, filteredMode] = args;
        if (filteredMode) {
          return [navCtrl, item];
        }
        else {
          return [navCtrl.parent, item];
        }
      })
      .subscribe((args) => {
        const [navCtrl, item] = args;
        navCtrl.push(TransactionDetailsPage, { item });
      });

    this.onInfinite$
      .flatMap((event) => {
        return this.sessionCache.updateSome$(this.params.listData, { requestParams: filter })
          .finally(() => event.complete());
      })
      .catch((error) => {
        console.error(error);
        return Observable.empty();
      })
      .finally(() => this.trackAnalyticsEvent("InfiniteScroll"))
      .subscribe();
  }

  private static CreateFilterParams(filterItem: any): Partial<TransactionSearchOptions> {
    if (filterItem instanceof Card) {
      return {
        filterBy: TransactionSearchFilterBy.Card,
        filterValue: filterItem.details.cardId
      };
    }
    else if (filterItem instanceof Driver) {
      return {
        filterBy: TransactionSearchFilterBy.Driver,
        filterValue: filterItem.details.promptId
      };
    }
    else {
      throw new Error(`Unrecognized transaction filter type: ${filterItem.constructor.name}.`);
    }
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
    this.params.listGroupDisplayOrder = this.params.dividerLabels = _.keys(groupedList).sort((groupA, groupB) => {
      return moment(this.calculateDateByLabelGroup(groupA)).isAfter(this.calculateDateByLabelGroup(groupB)) ? -1 : 1;
    });

    return groupedList;
  }

  protected sortItems(objects: BaseTransactionT[]): BaseTransactionT[] {
    return StaticListPage.sortList<BaseTransactionT>(objects, "effectiveDate", "desc");
  }

  public isItemActive(item: BaseTransactionT): boolean {
    return !(item instanceof PendingTransaction);
  }
}