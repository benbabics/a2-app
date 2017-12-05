import { NavController, NavParams } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { Driver, DriverStatus } from "@angular-wex/models";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { NameUtils } from "../../utils/name-utils";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { TransactionsDateView } from "../transactions/transactions-date-view/transactions-date-view";
import { Observable } from "rxjs";
import { DriversDetailsPage } from "./details/drivers-details";

export type DriversPageNavParams = keyof {
  transactionListMode
};

export namespace DriversPageNavParams {

  export const TransactionListMode: DriversPageNavParams = "transactionListMode";
}

@Component({
  selector: "page-drivers",
  templateUrl: "drivers.html"
})
@Reactive()
@TabPage()
export class DriversPage extends StaticListPage<Driver, Driver.Details> {

  private static readonly DRIVER_STATUSES: DriverStatus[] = [DriverStatus.ACTIVE, DriverStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Driver.Field[] = [
    "firstName",
    "lastName",
    "promptId"
  ];

  @StateEmitter.Alias("navParams.data." + DriversPageNavParams.TransactionListMode)
  private transactionListMode$: Observable<boolean>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    injector: Injector
  ) {
    super({
      pageName: "Drivers",
      listData: Session.Field.Drivers,
      listGroupDisplayOrder: DriversPage.DRIVER_STATUSES,
      dividerLabels: DriversPage.DRIVER_STATUSES.map(DriverStatus.displayName),
      searchFilterFields: DriversPage.SEARCH_FILTER_FIELDS
    }, injector);

    this.transactionListMode$
      .take(1)
      .filter(Boolean)
      .subscribe(() => this.params.trackView = false);

    this.onItemSelected$
      .withLatestFrom(this.transactionListMode$)
      .subscribe((args) => {
        let [driver, transactionListMode] = args;

        if (transactionListMode) {
          navCtrl.parent.push(TransactionsDateView, { filterItem: driver });
        }
        else {
          navCtrl.push(DriversDetailsPage, { driver });
        }
      });
  }

  protected groupItems(drivers: Driver[]): GroupedList<Driver> {
    return StaticListPage.defaultItemGroup<Driver, Driver.Details>(drivers, "status", DriversPage.DRIVER_STATUSES);
  }

  protected sortItems(drivers: Driver[]): Driver[] {
    return StaticListPage.defaultItemSort<Driver, Driver.Details>(drivers, "lastName", "asc");
  }

  public getFullName(driver: Driver): string {
    return NameUtils.PrintableName(driver.details.lastName, driver.details.firstName);
  }
}