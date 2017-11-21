import { NavController, NavParams, Events } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Component, Injector, DoCheck } from "@angular/core";
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriversDetailsPage } from "./details/drivers-details";
import { StaticListPage, FetchOptions, GroupedList } from "../static-list-page";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { TransactionsPage } from "../transactions/transactions";
import { TransactionDateSublist } from "../transactions/transactions-date-view/transactions-date-view";
import { TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { PageParams } from "../page";

@TabPage()
@Component({
  selector: "page-drivers",
  templateUrl: "drivers.html"
})
export class DriversPage extends StaticListPage<Driver, Driver.Details> {

  private static readonly DRIVER_STATUSES: DriverStatus[] = [DriverStatus.ACTIVE, DriverStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Driver.Field[] = [
    "firstName",
    "lastName",
    "promptId"
  ];

  protected readonly listGroupDisplayOrder: string[] = DriversPage.DRIVER_STATUSES;
  public readonly dividerLabels: string[] = DriversPage.DRIVER_STATUSES.map(DriverStatus.displayName);
  public readonly contentOnly: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    events: Events,
    injector: Injector
  ) {
    super("Drivers", injector, DriversPage.SEARCH_FILTER_FIELDS);

    events.subscribe("drivers:statusUpdate", () => this.updateList());
  }

  protected fetch(options?: FetchOptions): Observable<Driver[]> {
    return this.sessionCache.getSessionDetail(Session.Field.Drivers, options);
  }

  protected groupItems(drivers: Driver[]): GroupedList<Driver> {
    return StaticListPage.defaultItemGroup<Driver, Driver.Details>(drivers, "status", DriversPage.DRIVER_STATUSES);
  }

  protected sortItems(drivers: Driver[]): Driver[] {
    return StaticListPage.defaultItemSort<Driver, Driver.Details>(drivers, "lastName", "asc");
  }

  public goToDetailPage(driver: Driver): void {
    this.navCtrl.push( DriversDetailsPage, { driver } );
  }
}

export class TransactionDriverView extends DriversPage implements DoCheck {
  public readonly contentOnly: boolean = true;
  private heightHasBeenSet: boolean;
  public params: PageParams = {
    pageName: this.pageName,
    trackView: false
  };

  public ngDoCheck() {
    this.heightHasBeenSet = TransactionsPage.ResizeContentForTransactionHeader(this.content, this.heightHasBeenSet);
  }

  public goToDetailPage(item: Driver): Promise<any> {
    return this.navCtrl.parent.push(TransactionDateSublist, {
      filter: [TransactionSearchFilterBy.Driver, item.details.promptId],
      item
    });
  }
}