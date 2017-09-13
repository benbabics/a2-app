import { NavController, NavParams, Events } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Component, Injector } from "@angular/core";
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriversDetailsPage } from "./details/drivers-details";
import { StaticListPage, FetchOptions, GroupedList } from "../static-list-page";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { NameUtils } from "../../utils/name-utils";

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

  public getFullName(driver: Driver): string {
    return NameUtils.PrintableName(driver.details.lastName, driver.details.firstName);
  }
}
