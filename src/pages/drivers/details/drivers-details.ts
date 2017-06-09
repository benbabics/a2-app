import { Component } from '@angular/core';
import { NavParams, App } from 'ionic-angular';
import { Driver, OnlineApplication } from '@angular-wex/models';
import { DetailsPage } from "../../details-page";
import { SessionManager } from './../../../providers/session-manager';

type DriverDetailsOnlineApplicationFilter = {
  [P in keyof Driver.Details]?: OnlineApplication[];
};

@Component({
  selector: "page-drivers-details",
  templateUrl: "drivers-details.html"
})
export class DriversDetailsPage extends DetailsPage {
  public driver: Driver;

  constructor(
    sessionManager: SessionManager,

    private app:      App,
    public navParams: NavParams
  ) {
    super( "Drivers.Details", sessionManager );
    this.driver = this.navParams.get( "driver" );
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[ this.driver.details.status ] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[ this.driver.details.status ] || "information-circled";
  }

  public get areFieldsAccessible(): boolean {
    const userPlatform = this.session.user.details.onlineApplication;
    const accessibleFields = `${OnlineApplication.DISTRIBUTOR} ${OnlineApplication.WOL_NP}`;

    // "es2017" includes Array.prototype.includes()
    return !!accessibleFields.match( userPlatform );
  }
}
