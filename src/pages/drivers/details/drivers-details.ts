import { ActionSheetController, NavController } from "ionic-angular";
import * as _ from "lodash";
import { Component, Injector, ViewChild, ElementRef } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Driver, OnlineApplication, DriverStatus } from "@angular-wex/models";
import { DetailsPage } from "../../details-page";
import { NameUtils } from "../../../utils/name-utils";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";
import { TransactionsDateView } from "../../transactions/transactions-date-view/transactions-date-view";
import { DomSanitizer } from "@angular/platform-browser/";
import { SelectionPageController } from "../../../providers/index";
import { ToastOptions } from "ionic-angular/components/toast/toast-options";
import { DriverProvider } from "@angular-wex/api-providers";
import { Session } from "../../../models";
import { WexAppSnackbarController } from "../../../components/index";

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
  @EventSource() private contactDriver$: Observable<void>;

  @StateEmitter.From("navParams.data.driver")
  private driver$: Subject<Driver>;

  @StateEmitter() private showCellPhoneNumber$: Subject<boolean>;
  @StateEmitter() private showEmailAddress$: Subject<boolean>;
  @StateEmitter() private fullName$: Subject<string>;

  @StateEmitter(ViewChild("sms")) smsDriver$: Subject<ElementRef>;
  @StateEmitter(ViewChild("tel")) telDriver$: Subject<ElementRef>;

  constructor(
    public navParams: NavParams,
    private domSanitizer: DomSanitizer,
    wexAppSnackbarController: WexAppSnackbarController,
    driverProvider: DriverProvider,
    selectionPageController: SelectionPageController,
    actionSheetController: ActionSheetController,
    navController: NavController,
    injector: Injector
  ) {
    super("Drivers.Details", injector);

    Observable.combineLatest(this.driver$, this.sessionCache.session$).subscribe((args) => {
      let [driver, session] = args;
      let onlineApplication = session.user.details.onlineApplication;

      this.fullName$.next(NameUtils.PrintableName(driver.details.firstName, driver.details.lastName));

      this.showCellPhoneNumber$.next(driver.details.cellPhoneNumber && _.includes(this.PHONE_SUPPORTED_PLATFORMS, onlineApplication));
      // TODO - Add emailAddress field to DriverDetails
      this.showEmailAddress$.next((<any>driver.details).emailAddress && _.includes(this.EMAIL_SUPPORTED_PLATFORMS, onlineApplication));
    });

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.statusUpdateMessageDuration,
      position: "top"
    };

    this.onChangeStatus$
      .flatMap(() => this.driver$.asObservable().take(1))
      .flatMap(driver => selectionPageController.presentSelectionPage({
        pageName: this.CONSTANTS.CHANGE_STATUS.title,
        options: [
          { value: DriverStatus.ACTIVE, label: DriverStatus.displayName(DriverStatus.ACTIVE) },
          { value: DriverStatus.TERMINATED, label: DriverStatus.displayName(DriverStatus.TERMINATED) }
        ],
        submittedItem: driver.details.status,
        submitButtonText: this.CONSTANTS.CHANGE_STATUS.LABELS.select
      }))
      .withLatestFrom(this.driver$, this.sessionCache.session$)
      .flatMap(args => {
        let [status, driver, session]: [DriverStatus, Driver, Session] = args;
        let accountId = session.user.billingCompany.details.accountId;
        let driverId = driver.details.driverId;
        let promptId = driver.details.promptId;
        return driverProvider.updateStatus(accountId, driverId, status, promptId);
      })
      .map(driver => {
        toastOptions.message = this.CONSTANTS.CHANGE_STATUS.bannerStatusChangeSuccess;
        this.driver$.next(driver);
        return driver;
      })
      .catch(() => {
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        return Observable.empty<Driver>();
      })
      .finally(() => wexAppSnackbarController.createQueued(toastOptions).present())
      .subscribe();

    this.onViewTransactions$
      .flatMap(() => this.driver$.asObservable().take(1))
      .subscribe(driver => navController.push(TransactionsDateView, { filterItem: driver }));

    this.contactDriver$
      .flatMapTo(this.driver$)
      .flatMap((driver: Driver) => new Observable<any>((observer) => {
        actionSheetController.create({
          title: this.CONSTANTS.CONTACT.contact + driver.fullName,
          buttons: [
            {
              text: this.CONSTANTS.CONTACT.call,
              icon: this.platform.isIos ? "" : this.CONSTANTS.CONTACT.callIcon,
              handler: () => { this.telDriver$.subscribe(observer); }
            }, {
              text: this.CONSTANTS.CONTACT.textMessage,
              icon: this.platform.isIos ? "" : this.CONSTANTS.CONTACT.textIcon,
              handler: () => { this.smsDriver$.subscribe(observer); }
            }, {
              text: "Cancel",
              icon: this.platform.isIos ? "" : this.CONSTANTS.CONTACT.cancelIcon,
              role: "cancel"
            }
          ]
        }).present();
      }).take(1))
      .subscribe(element => element.nativeElement.click());
    }

  public cleanPhone(contactType: string, phoneNumber: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(contactType + phoneNumber.replace(/[^0-9]/g, ""));
  }
}
