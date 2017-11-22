import { WexAppSnackbarController } from "./../../../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { ActionSheetController, ToastOptions, Platform, NavController } from "ionic-angular";
import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Driver, DriverStatus, OnlineApplication } from "@angular-wex/models";
import { DriverProvider, TransactionSearchFilterBy } from "@angular-wex/api-providers";
import { DetailsPage } from "../../details-page";
import { TransactionsPage, TransactionListType } from "../../transactions/transactions";
import { NameUtils } from "../../../utils/name-utils";
import { Session } from "../../../models";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";

interface DriverStatusDetails {
  id: DriverStatus;
  label: string;
  trackingId: string;
  icon: string;
}

@Component({
  selector: "page-drivers-details",
  templateUrl: "drivers-details.html"
})
@Reactive()
export class DriversDetailsPage extends DetailsPage {

  private readonly EMAIL_SUPPORTED_PLATFORMS = [OnlineApplication.DISTRIBUTOR, OnlineApplication.WOL_NP];
  private readonly PHONE_SUPPORTED_PLATFORMS = [OnlineApplication.DISTRIBUTOR, OnlineApplication.WOL_NP];

  @EventSource() private onChangeStatus$: Observable<void>;
  @EventSource() private onViewTransactions$: Observable<void>;

  @StateEmitter.From("navParams.data.driver")
  private driver$: Subject<Driver>;

  @StateEmitter() private isChangingStatus$: Subject<boolean>;
  @StateEmitter() private statusColor$: Subject<string>;
  @StateEmitter() private statusIcon$: Subject<string>;
  @StateEmitter() private showCellPhoneNumber$: Subject<boolean>;
  @StateEmitter() private showEmailAddress$: Subject<boolean>;
  @StateEmitter() private fullName$: Subject<string>;

  constructor(
    public navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private driverProvider: DriverProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
    private platform: Platform,
    navController: NavController,
    injector: Injector
  ) {
    super("Drivers.Details", injector);

    Observable.combineLatest(this.driver$, this.sessionCache.session$).subscribe((args) => {
      let [driver, session] = args;
      let onlineApplication = session.user.details.onlineApplication;

      this.fullName$.next(NameUtils.PrintableName(driver.details.firstName, driver.details.lastName));

      this.statusColor$.next(this.CONSTANTS.STATUS.COLOR[driver.details.status] || "warning");
      this.statusIcon$.next(this.CONSTANTS.STATUS.ICON[driver.details.status] || "information-circled");

      this.showCellPhoneNumber$.next(driver.details.cellPhoneNumber && _.includes(this.PHONE_SUPPORTED_PLATFORMS, onlineApplication));
      // TODO - Add emailAddress field to DriverDetails
      this.showEmailAddress$.next((<any>driver.details).emailAddress && _.includes(this.EMAIL_SUPPORTED_PLATFORMS, onlineApplication));
    });

    this.onChangeStatus$
      .flatMap(() => this.changeStatus$(this.CONSTANTS.statusOptions))
      .subscribe(driver => this.driver$.next(driver));

    this.onViewTransactions$
      .flatMap(() => this.driver$.asObservable().take(1))
      .subscribe((driver) => {
        navController.push(TransactionsPage, {
          selectedList: TransactionListType.Date,
          filter: [TransactionSearchFilterBy.Driver, driver.details.promptId]
        });
      });
  }

  private changeStatus$(driverStatuses: DriverStatusDetails[]): Observable<Driver> {
    return this.showStatusSelector$(driverStatuses)
      .withLatestFrom(this.driver$, this.sessionCache.session$)
      .flatMap((args) => {
        let [driverStatus, driver, session] = args;

        if (driverStatus === driver.details.status) {
          return Observable.of(driver);
        }

        let toastOptions: ToastOptions = {
          message: null,
          duration: this.CONSTANTS.statusUpdateMessageDuration,
          position: "top"
        };
        let accountId = session.user.billingCompany.details.accountId;
        let driverId = driver.details.driverId;
        let promptId = driver.details.promptId;

        this.isChangingStatus$.next(true);

        return this.driverProvider.updateStatus(accountId, driverId, driverStatus, promptId)
          .map((driver: Driver) => {
            // Update the cached drivers
            this.sessionCache.update$(Session.Field.Drivers).subscribe();

            toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
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
      });
  }

  private showStatusSelector$(driverStatuses: DriverStatusDetails[]): Observable<DriverStatus> {
    let driverStatusSubject = new Subject<DriverStatus>();

    this.actionSheetController.create({
      title: this.CONSTANTS.actionStatusTitle,
      buttons: [
        ...driverStatuses.map((action) => ({
          text: action.label,
          icon: !this.platform.is("ios") ? action.icon : null,
          handler: () => driverStatusSubject.next(action.id)
        })),
        {
          text: this.CONSTANTS.actionStatusCancel,
          role: "cancel",
          icon: !this.platform.is("ios") ? "close" : null,
        }
      ]
    }).present();

    return driverStatusSubject.asObservable();
  }
}
