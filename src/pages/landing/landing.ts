import { WexAppSnackbarController } from "./../../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { UiNotificationsController } from "../../providers";
import { Component, Injector } from "@angular/core";
import { NavController, NavParams, ToastOptions } from "ionic-angular";
import { InvoiceSummary, CompanyStub } from "@angular-wex/models";
import { Session } from "../../models";
import { SecurePage } from "../secure-page";
import { BrandProvider } from "@angular-wex/api-providers";
import { WexAppBackButtonController } from "../../providers/wex-app-back-button-controller";
import { NameUtils } from "../../utils/name-utils";
import { OptionsPage } from "../options/options";
import { Value } from "../../decorators/value";
import { PageTheme, StatusBarStyle } from "../../decorators/status-bar";
import { StateEmitter, EventSource, Reactive } from "angular-rxjs-extensions";
import { ViewWillEnter, ViewWillLeave, ViewDidEnter } from "angular-rxjs-extensions-ionic";
import { Observable, Subject } from "rxjs";


@Component({
  selector: "page-landing",
  templateUrl: "landing.html"
})
@Reactive()
@StatusBarStyle(PageTheme.Light)
export class LandingPage extends SecurePage {

  @Value("APP_TITLE") APP_TITLE: string;

  @ViewWillEnter() private viewWillEnter$: Observable<void>;
  @ViewWillLeave() private viewWillLeave$: Observable<void>;
  @ViewDidEnter() private viewDidEnter$: Observable<void>;
  @EventSource() private onShowOptions$: Observable<any>;

  @StateEmitter.Alias("session$.user.billingCompany")
  private billingCompany$: Observable<CompanyStub>;

  @StateEmitter.Alias("session$.invoiceSummary")
  private invoiceSummary$: Observable<InvoiceSummary>;

  @StateEmitter() private companyName$: Subject<string>;
  @StateEmitter() private paymentPercent$: Subject<number>;
  @StateEmitter() private remainingBalance$: Subject<number>;
  @StateEmitter() private creditLimit$: Subject<number>;
  @StateEmitter() private progressBarColor$: Subject<string>;
  @StateEmitter() private progressBarStyles$: Subject<string>;
  @StateEmitter({ initialValue: 0 }) private currentPaymentPercent$: Subject<number>;
  @StateEmitter() private brandLogoData$: Subject<string>;

  //private isCurrentView$ = new BehaviorSubject<boolean>(false);
  private onHardwareBackButton$ = new Subject<void>();

  private readonly REQUIRED_SESSION_FIELDS: Session.Field[] = [
    Session.Field.User,
    Session.Field.InvoiceSummary
  ];

  constructor(
    brandProvider: BrandProvider,
    uiNotificationsController: UiNotificationsController,
    wexAppSnackbarController: WexAppSnackbarController,
    wexAppBackButtonController: WexAppBackButtonController,
    public injector: Injector,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Landing", injector);

    const registerBackButtonAction = () => wexAppBackButtonController.registerAction(() => this.onHardwareBackButton$.next());

    this.session$
      .filter(Boolean)
      .distinctUntilKeyChanged(Session.Field.User)
      .flatMap(session => brandProvider.logo(session.user.details.brand))
      .subscribe((brandLogoData: string) => this.brandLogoData$.next(brandLogoData), () => this.brandLogoData$.next(""));

    this.billingCompany$
      .filter(Boolean)
      .subscribe(billingCompany => this.companyName$.next(NameUtils.PrintableName(billingCompany.details.name)));

    this.invoiceSummary$
      .filter(Boolean)
      .subscribe(invoiceSummary => {
        let paymentPercent = Math.min(invoiceSummary.details.currentBalance / invoiceSummary.details.creditLimit * 100, 100);
        let progressBarColor = (() => {
          if (paymentPercent <= 50) {
            return "green";
          } else if (paymentPercent <= 75) {
            return "yellow";
          } else {
            return "red";
          }
        })();

        this.paymentPercent$.next(paymentPercent);
        this.remainingBalance$.next(Math.floor(invoiceSummary.details.creditLimit - invoiceSummary.details.currentBalance));
        this.creditLimit$.next(Math.floor(invoiceSummary.details.creditLimit));
        this.progressBarColor$.next(progressBarColor);
        this.progressBarStyles$.next(`${progressBarColor} wex-payment-bar`);

        // Delayed change in currentPaymentPercent forces credit-bar to slide smoothly.
        setTimeout(() => this.currentPaymentPercent$.next(paymentPercent), 100);
      });

    // Update the page's relevant session details when the page is entered
    this.viewWillEnter$
      .flatMap(() => this.sessionCache.updateSome$(this.REQUIRED_SESSION_FIELDS))
      .subscribe();

    this.viewDidEnter$
      .map(() => registerBackButtonAction())
      .map(() => uiNotificationsController.presentFingerprintProfileSuccessMessage())
      .subscribe();

    this.viewWillLeave$.subscribe(() => wexAppBackButtonController.deregisterAction());

    this.onHardwareBackButton$.asObservable()
      .map(() => wexAppBackButtonController.deregisterAction())
      .subscribe(() => {
        // Show the exit prompt snackbar
        let queued = wexAppSnackbarController.createQueued(this.CONSTANTS.BACK_TO_EXIT as ToastOptions);
        queued.onDidDismiss(() => {
          // If this is the active page, re-register the exit prompt for the next click
          if (navCtrl.getActive().name === this.constructor.name) {
            registerBackButtonAction();
          }
        });
        queued.present();
      });

    this.onShowOptions$.subscribe(() => navCtrl.push(OptionsPage));
  }
}
