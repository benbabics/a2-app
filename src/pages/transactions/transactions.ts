import { Component, Injector, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { TabPage } from "../../decorators/tab-page";
import { Value } from "../../decorators/value";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { TransactionsDateView } from "./transactions-date-view/transactions-date-view";
import { DriversPage } from "../drivers/drivers";
import { CardsPage } from "../cards/cards";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";
import { ViewDidLoad } from "angular-rxjs-extensions-ionic";
import { SecurePage } from "../secure-page";

export type TransactionListType = keyof {
  Date,
  Driver,
  Card
};

export namespace TransactionListType {
  export const Date: TransactionListType = "Date";
  export const Driver: TransactionListType = "Driver";
  export const Card: TransactionListType = "Card";
}

@Component({
  selector: "page-transactions",
  templateUrl: "transactions.html"
})
@Reactive()
@TabPage()
export class TransactionsPage extends SecurePage {

  @Value("STORAGE.KEYS.LAST_TRANSACTION_VIEW")
  private readonly LAST_TRANSACTION_VIEW_KEY: string;

  public readonly DEFAULT_PAGE = TransactionsDateView;

  @ViewDidLoad() private viewDidLoad$: Observable<void>;

  @StateEmitter({ initialValue: TransactionListType.Date }) private currentViewSegment$: Subject<TransactionListType>;

  @ViewChild("listNav") private listNav: NavController;

  constructor(injector: Injector, localStorageService: LocalStorageService) {
    super({ pageName: "Transactions", trackingName: "TransactionsList" }, injector);

    const lastViewSegment = localStorageService.get<TransactionListType>(this.LAST_TRANSACTION_VIEW_KEY);

    if (lastViewSegment) {
      this.currentViewSegment$.next(lastViewSegment);
    }

    this.viewDidLoad$
      .flatMapTo(this.currentViewSegment$)
      .subscribe((currentViewSegment) => {
        this.listNav.setRoot(this.getPageForListType(currentViewSegment), { transactionListMode: true }, { animate: false });
        this.trackAnalyticsEvent(currentViewSegment);
        localStorageService.set(this.LAST_TRANSACTION_VIEW_KEY, currentViewSegment);
      });
  }

  private getPageForListType(listType: TransactionListType): any {
    switch (listType) {
      case TransactionListType.Driver: return DriversPage;
      case TransactionListType.Card: return CardsPage;
      case TransactionListType.Date: return TransactionsDateView;

      default: throw new Error(`Unrecognized transaction list type "${listType}".`);
    }
  }
}