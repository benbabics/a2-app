import { Component, Injector } from "@angular/core";
import { ToastOptions, NavController, NavParams } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { Driver, DriverStatus } from "@angular-wex/models";
import { DriverProvider } from "@angular-wex/api-providers";
import { WexPlatform } from "../../../../providers/platform";
import { WexAppSnackbarController } from "../../../../components";
import { Reactive, EventSource, StateEmitter } from "angular-rxjs-extensions";
import { Observable, Subject } from "rxjs";
import { Session } from "../../../../models";

@Component({
  selector: "page-driver-change-status",
  templateUrl: "change-status.html"
})
@Reactive()
export class DriverChangeStatusPage extends SecurePage {
  public readonly statusOptions: DriverStatus[] = [DriverStatus.ACTIVE, DriverStatus.TERMINATED];

  @EventSource() private onChangeStatus$: Observable<void>;

  @StateEmitter.From("navParams.data.driver")
  private driver$: Subject<Driver>;

  @StateEmitter.From("driver$.details.status")
  private driverStatus$: Subject<DriverStatus>;

  @StateEmitter() private isChangingStatus$: Subject<boolean>;
  @StateEmitter() private disableChangeStatus$: Subject<boolean>;

  constructor(
    injector: Injector,
    public navParams: NavParams,
    public platform: WexPlatform,
    private navCtrl: NavController,
    private driverProvider: DriverProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
  ) {
    super({ pageName: "Drivers.Change_Status" }, injector);

    this.onChangeStatus$
      .flatMapTo(Observable.combineLatest(this.driver$, this.driverStatus$))
      .flatMap(args => this.selectStatus$(args[0], args[1]))
      .subscribe(driver => this.driver$.next(driver));

    Observable.combineLatest(this.driver$, this.driverStatus$, this.isChangingStatus$)
      .subscribe(args => {
        let [driver, driverStatus, isChangingStatus] = args;
        const matchingStatus = driverStatus === driver.details.status;
        this.disableChangeStatus$.next(matchingStatus || isChangingStatus);
      });
  }

  public displayOptionLabel(status: DriverStatus) {
    return DriverStatus.displayName(status);
  }

  private selectStatus$(driver: Driver, driverStatus: DriverStatus): Observable<Driver> {
    if (driverStatus === driver.details.status) {
      return;
    }

    this.isChangingStatus$.next(true);

    let accountId = this.session.user.billingCompany.details.accountId;
    let driverId = driver.details.driverId;
    let promptId = driver.details.promptId;

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.statusUpdateMessageDuration,
      position: "top"
    };

    return this.driverProvider.updateStatus(accountId, driverId, driverStatus, promptId)
      .map((updatedDriver: Driver) => {
          driver.details.status = updatedDriver.details.status;
          this.sessionCache.update$(Session.Field.Drivers).subscribe();
          toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
          this.navCtrl.pop();

          return driver;
      })
      .catch(() => {
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        return Observable.empty<Driver>();
      })
      .finally(() => {
        this.isChangingStatus$.next(false);
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
  }
}
