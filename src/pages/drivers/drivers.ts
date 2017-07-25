import { NavController, NavParams } from 'ionic-angular';
import { SessionManager } from './../../providers/session-manager';
import { Observable } from 'rxjs/Observable';
import { Component, Injector } from '@angular/core';
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriversDetailsPage } from './details/drivers-details';
import { StaticListPage, FetchOptions, GroupedList } from "../static-list-page";
import { Session } from "../../models";

@Component({
  selector: "page-drivers",
  templateUrl: "drivers.html"
})
export class DriversPage extends StaticListPage<Driver, Driver.Details> {

  private static readonly DRIVER_STATUSES: DriverStatus[] = [DriverStatus.ACTIVE, DriverStatus.SUSPENDED, DriverStatus.TERMINATED];
  private static readonly SEARCH_FILTER_FIELDS: Driver.Field[] = [
    "firstName",
    "lastName",
    "promptId"
  ];

  protected readonly listGroupDisplayOrder: string[] = DriversPage.DRIVER_STATUSES;
  public readonly dividerLabels: string[] = DriversPage.DRIVER_STATUSES.map(DriverStatus.displayName);

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams,
    injector: Injector
  ) {
    super("Drivers", injector, DriversPage.SEARCH_FILTER_FIELDS);
  }

  protected fetch(options?: FetchOptions): Observable<Driver[]> {
    return this.sessionManager.cache.getSessionDetail(Session.Field.Drivers, options);
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
