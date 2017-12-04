import { Component, Injector } from "@angular/core";
import { NavParams, Events, ToastOptions, NavController } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriverProvider } from "@angular-wex/api-providers";
import { WexPlatform } from "../../../../providers/platform";
import { WexAppSnackbarController } from "../../../../components";

@Component({
  selector: "page-driver-change-status",
  templateUrl: "change-status.html"
})
export class DriverChangeStatusPage extends SecurePage {
  public driver: Driver;
  public driverStatus: DriverStatus;
  public statusOptions: DriverStatus[] = [DriverStatus.ACTIVE, DriverStatus.TERMINATED];
  public isChangingStatus: boolean = false;

  constructor(
    injector: Injector,
    public platform: WexPlatform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private driverProvider: DriverProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
  ) {
    super({ pageName: "Drivers.Change_Status" }, injector);
    this.driver = this.navParams.get("driver");
    this.driverStatus = this.driver.details.status;
  }

  public get disableChangeStatus(): boolean {
    const matchingStatus = this.driverStatus === this.driver.details.status;
    return matchingStatus || this.isChangingStatus;
  }

  public displayOptionLabel(status: DriverStatus) {
    return DriverStatus.displayName(status);
  }

  public handleSelectStatus() {
    if (this.driverStatus === this.driver.details.status) {
      return;
    }

    this.isChangingStatus = true;

    let accountId = this.session.user.billingCompany.details.accountId;
    let driverId = this.driver.details.driverId;
    let promptId = this.driver.details.promptId;

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.statusUpdateMessageDuration,
      position: "top"
    };

    this.driverProvider.updateStatus(accountId, driverId, this.driverStatus, promptId).subscribe(
      (driver: Driver) => {
        this.driver.details.status = driver.details.status;
        this.isChangingStatus = false;
        this.events.publish("drivers:statusUpdate");

        this.navCtrl.pop();
        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.wexAppSnackbarController.createQueued({ ...toastOptions, important: true }).present();
      }, () => {
        this.isChangingStatus = false;
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
  }
}
