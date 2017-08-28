import { WexAppSnackbarController } from "./../../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { NavBarController } from "../../providers";
import { Component, Injector } from "@angular/core";
import { NavController, NavParams, PopoverController, Platform, ToastOptions } from "ionic-angular";
import { InvoiceSummary, CompanyStub } from "@angular-wex/models";
import { Session } from "../../models";
import { SecurePage } from "../secure-page";
import { OptionsPopoverPage } from "./options-popover/options-popover";
import { BrandProvider } from "@angular-wex/api-providers";
import { WexAppBackButtonController } from "../../providers/wex-app-back-button-controller";
import { NameUtils } from "../../utils/name-utils";

@Component({
  selector: "page-landing",
  templateUrl: "landing.html"
})
export class LandingPage extends SecurePage {

  private readonly REQUIRED_SESSION_FIELDS: Session.Field[] = [
    Session.Field.User,
    Session.Field.InvoiceSummary,
    Session.Field.Payments
  ]; //72 hours
  private isCurrentView: boolean;

  public scheduledPaymentsCount = 0;
  public brandLogoData: string;

  public get companyName(): string {
    return NameUtils.PrintableName(this.billingCompany.details.name);
  }

  public get paymentPercent(): number {
    let value = this.invoiceSummary.details.currentBalance / this.invoiceSummary.details.creditLimit * 100;
    return value <= 100 ? value : 100;
  }

  public get remainingBalance(): number {
    return Math.floor(this.invoiceSummary.details.creditLimit - this.invoiceSummary.details.currentBalance);
  }

  public get creditLimit(): number {
    return Math.floor(this.invoiceSummary.details.creditLimit);
  }

  public get progressBarColor(): string {
    let value = this.paymentPercent;

    if (value >= 0 && value < 50) {
      return "green";
    } else if (value >= 50 && value < 75) {
      return "yellow";
    } else {
      return "red";
    }
  }

  public get progressBarStyles(): string {
    return `${this.progressBarColor} wex-payment-bar`;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private brandProvider: BrandProvider,
    private navBarController: NavBarController,
    private platform: Platform,
    private wexAppSnackbarController: WexAppSnackbarController,
    public injector: Injector,
    private wexAppBackButtonController: WexAppBackButtonController
  ) {
    super("Landing", injector);
  }

  private registerBackButton = () => {
    if (this.isCurrentView) {
      this.wexAppBackButtonController.registerAction(this.hardwareBackSnackbar);
    }
  }

  private hardwareBackSnackbar = () => {
    this.wexAppBackButtonController.registerAction(this.platform.exitApp);
    let queued = this.wexAppSnackbarController.createQueued(this.CONSTANTS.BACK_TO_EXIT as ToastOptions);
    queued.onDidDismiss(this.registerBackButton);
    queued.present();
  }

  public get billingCompany(): CompanyStub {
    return this.session.user.billingCompany;
  }

  public get invoiceSummary(): InvoiceSummary {
    return this.session.invoiceSummary;
  }

  ionViewWillEnter() {
    //don't pre-fetch the data for this page to allow for dynamic in-page loading
    this.sessionManager.cache.getSessionDetails(this.REQUIRED_SESSION_FIELDS)
      .subscribe((session: Session) => {
        this.session = session;

        let scheduledCount = this.session.payments.filter(payment => payment.isScheduled).length;

        // Update the payment tab badge with the scheduled count
        this.navBarController.paymentsBadgeText = scheduledCount > 0 ? String(scheduledCount) : "";

        this.brandProvider.logo(this.session.user.details.brand)
          .subscribe((brandLogoData: string) => this.brandLogoData = brandLogoData);
      });
  }

  ionViewDidEnter() {
    this.isCurrentView = true;
    this.registerBackButton();
  }

  ionViewWillLeave() {
    this.isCurrentView = false;
    this.wexAppBackButtonController.deregisterAction();
  }

  public onShowOptions($event) {
    let popover = this.popoverCtrl.create(OptionsPopoverPage);

    popover.present({ ev: $event });
  }
}
