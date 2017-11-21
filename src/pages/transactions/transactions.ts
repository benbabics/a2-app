import { Component, Injector, ViewChild, DoCheck, ElementRef } from "@angular/core";
import { NavController, NavParams, Content } from "ionic-angular";
import { TabPage } from "../../decorators/tab-page";
import { Value } from "../../decorators/value";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { TransactionDriverView } from "../drivers/drivers";
import { TransactionCardView } from "../cards/cards";
import { Page } from "../page";
import { TransactionDateView } from "./transactions-date-view/transactions-date-view";

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

@TabPage()
@Component({
  selector: "page-transactions",
  templateUrl: "transactions.html"
})
export class TransactionsPage extends Page implements DoCheck {
  @Value("STORAGE.KEYS.LAST_TRANSACTION_VIEW") private readonly LAST_TRANSACTION_VIEW_KEY: string;
  @ViewChild("listNav") listNav: NavController;
  @ViewChild("header") header: ElementRef;

  public readonly TransactionListType = {
    Date: TransactionListType.Date,
    DriverName: TransactionListType.Driver,
    CardNumber: TransactionListType.Card
  };

  public get rootListType(): any {
    if (this.lastViewSegment === TransactionListType.Driver) {
      return TransactionDriverView;
    } else if (this.lastViewSegment === TransactionListType.Card) {
      return TransactionCardView;
    } else {
      return TransactionDateView;
    }
  }

  public static HEADER_HEIGHT: number = 0;
  public lastViewSegment: TransactionListType;

  ngDoCheck() {
    try {
      TransactionsPage.HEADER_HEIGHT = (this.header as any).nativeElement.clientHeight;
    } catch (e) {
      TransactionsPage.HEADER_HEIGHT = 0;
    }
  }

  constructor(private localStorageService: LocalStorageService, public navCtrl: NavController, public navParams: NavParams, public injector: Injector) {
    super({ pageName: "Transactions", trackingName: "TransactionsList" }, injector);
    this.lastViewSegment = this.localStorageService.get(this.LAST_TRANSACTION_VIEW_KEY) as TransactionListType;
    if (!this.lastViewSegment) {
      this.lastViewSegment = TransactionListType.Date;
      this.localStorageService.add(this.LAST_TRANSACTION_VIEW_KEY, this.lastViewSegment);
    }
  }

  public selectList(listType: TransactionListType): Promise<any> {
    this.trackAnalyticsEvent(listType);
    this.localStorageService.set(this.LAST_TRANSACTION_VIEW_KEY, listType);
    this.lastViewSegment = listType;
    return this.listNav.setRoot(this.rootListType, {  }, { animate: false });
  }

  public static ResizeContentForTransactionHeader(content: Content, heightHasBeenSet: boolean): boolean {
    let element = content._elementRef.nativeElement;
    if (!heightHasBeenSet && !!TransactionsPage.HEADER_HEIGHT) {
      let originalHeight = element.clientHeight;
      element.style.height = `${originalHeight - TransactionsPage.HEADER_HEIGHT}px`;
      element.style.top = `${TransactionsPage.HEADER_HEIGHT - 1}px`;
    }

    return !!TransactionsPage.HEADER_HEIGHT;
  }
}