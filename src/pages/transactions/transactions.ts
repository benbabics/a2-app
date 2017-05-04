import { Observable } from 'rxjs';
import * as _ from "lodash";
import { Component } from "@angular/core";
import { NavController, NavParams, SegmentButton } from "ionic-angular";
import { SessionManager } from "../../providers/session-manager";
import { StaticListPage, FetchOptions } from "../static-list-page";
import { Session } from "../../models";
import { WexGreeking } from "../../components";
import { SessionCache } from "../../providers";

type TransactionListType = keyof {
  Date,
  DriverName,
  CardNumber
};

namespace TransactionListType {
  export const Date: TransactionListType = "Date";
  export const DriverName: TransactionListType = "DriverName";
  export const CardNumber: TransactionListType = "CardNumber";
}

@Component({
  selector: "page-transactions",
  templateUrl: "transactions.html"
})
export class TransactionsPage extends StaticListPage<any, any> {

  public selectedList: TransactionListType = TransactionListType.CardNumber;

  constructor(public navCtrl: NavController, public navParams: NavParams, sessionManager: SessionManager) {
    super("Transactions", sessionManager);
  }

  protected fetch(options?: FetchOptions): Observable<any[]> {
    switch (this.selectedList) {
      case TransactionListType.Date:
        if (options.clearItems && options.forceRequest && !!SessionCache.cachedValues.postedTransactionsInfo) {
          SessionCache.cachedValues.postedTransactionsInfo.details.currentPage = 0;
        }

        return this.sessionManager.cache.getSessionDetail(Session.Field.PostedTransactions, options);

      case TransactionListType.DriverName:
        return this.sessionManager.cache.getSessionDetail(Session.Field.Drivers, options);

      case TransactionListType.CardNumber:
        return this.sessionManager.cache.getSessionDetail(Session.Field.Cards, options);
    }
  }

  protected sortItems(objects: any[]): any[] {
    switch (this.selectedList) {
      case TransactionListType.Date:
        return this.defaultItemSort(objects, "transactionDate", "desc");
      case TransactionListType.DriverName:
        return this.defaultItemSort(objects, "lastName", "asc");
      case TransactionListType.CardNumber:
        return this.defaultItemSort(objects, "cardId", "asc");
    }
  }

  public get greekingData(): WexGreeking.Rect[] {
    switch (this.selectedList) {
      case TransactionListType.Date:
        return this.CONSTANTS.DATE.greekingData;
      case TransactionListType.DriverName:
        return this.CONSTANTS.DRIVER_NAME.greekingData;
      case TransactionListType.CardNumber:
        return this.CONSTANTS.CARD_NUMBER.greekingData;
    }
  }

  public set greekingData(data) { }

  public get hasMoreItems(): boolean {
    switch (this.selectedList) {
      case TransactionListType.Date:
        return this.items.length < _.get(SessionCache.cachedValues, "postedTransactionsInfo.details.totalResults", 0);
      default: return false;
    }
  }

  public get isCardView(): boolean {
    return this.selectedList === TransactionListType.CardNumber;
  }

  public get isDateView(): boolean {
    return this.selectedList === TransactionListType.Date;
  }

  public get isDriverView(): boolean {
    return this.selectedList === TransactionListType.DriverName;
  }

  public get listLabels(): string[] {
    switch (this.selectedList) {
      case TransactionListType.Date:
        return this.CONSTANTS.DATE.listLabels;
      case TransactionListType.DriverName:
        return this.CONSTANTS.DRIVER_NAME.listLabels;
      case TransactionListType.CardNumber:
        return this.CONSTANTS.CARD_NUMBER.listLabels;
    }
  }

  public set listLabels(labels) { }

  public onSelectList(selection: SegmentButton) {
    this.selectedList = selection.value as TransactionListType;

    // Re-render the list
    this.fetchResults().subscribe();
  }

  public onInfinite(event: any): Promise<any> {
    return this.fetchResults({
      forceRequest: true,
      clearItems: false
    })
      .toPromise()
      .then(() => event.complete());
  }
}
