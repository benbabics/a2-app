import { NavController, NavParams } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriversDetailsPage } from "./details/drivers-details";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Session } from "../../models";
import { TabPage } from "../../decorators/tab-page";
import { NameUtils } from "../../utils/name-utils";
import { Reactive } from "angular-rxjs-extensions";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    injector: Injector
  ) {
    super({
      pageName: "Drivers",
      listDataField: Session.Field.Drivers,
      listGroupDisplayOrder: DriversPage.DRIVER_STATUSES,
      dividerLabels: DriversPage.DRIVER_STATUSES.map(DriverStatus.displayName),
      searchFilterFields: DriversPage.SEARCH_FILTER_FIELDS
    }, injector);

    this.onItemSelected$.subscribe(driver => this.navCtrl.push( DriversDetailsPage, { driver } ));
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
