import { NavController } from "ionic-angular";
import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Driver, OnlineApplication } from "@angular-wex/models";
import { TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { DetailsPage } from "../../details-page";
import { NameUtils } from "../../../utils/name-utils";
import { TransactionDateSublist } from "../../transactions/transactions-date-view/transactions-date-view";
import { WexPlatform } from "../../../providers";
import { DriverChangeStatusPage } from "./change-status/change-status";

@Component({
  selector: "page-drivers-details",
  templateUrl: "drivers-details.html"
})
export class DriversDetailsPage extends DetailsPage {
  public driver: Driver;
  public isChangingStatus: boolean = false;

  constructor(
    public navParams: NavParams,
    public platform: WexPlatform,
    private navController: NavController,
    injector: Injector
  ) {
    super( "Drivers.Details", injector );
    this.driver = this.navParams.get( "driver" );
  }

  public get areFieldsAccessible(): boolean {
    const userPlatform = this.session.user.details.onlineApplication;
    const accessibleFields = [OnlineApplication.DISTRIBUTOR, OnlineApplication.WOL_NP];

    return _.includes( accessibleFields, userPlatform );
  }

  public get fullName(): string {
    return NameUtils.PrintableName(this.driver.details.firstName, this.driver.details.lastName);
  }

  public changeStatus() {
    const driver = this.driver;
    this.navController.push(DriverChangeStatusPage, { driver });
  }

  public viewTransactions() {
    this.navController.push(TransactionDateSublist, {
      filter: [TransactionSearchFilterBy.Driver, this.driver.details.promptId]
    });
  }
}
