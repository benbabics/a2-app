import { NavController, NavParams } from 'ionic-angular';
import { SessionManager } from './../../providers/session-manager';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Driver, DriverStatus } from "@angular-wex/models";
import { StaticListPage, FetchOptions } from "../static-list-page";
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

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Drivers", sessionManager, DriversPage.SEARCH_FILTER_FIELDS);
  }

  protected fetch(options?: FetchOptions): Observable<Driver[]> {
    return this.sessionManager.cache.getSessionDetail(Session.Field.Drivers, options);
  }

  protected sortItems(drivers: Driver[]): Driver[] {
    return StaticListPage.defaultItemSort<Driver, Driver.Details>(drivers, "lastName", "asc");
  }
}
