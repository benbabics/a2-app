import { InvoiceProvider } from "../../providers";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Company, InvoiceSummary } from "../../models";
import { SecurePage } from "../secure-page";

@Component({
  selector: "page-landing",
  templateUrl: "landing.html"
})
export class LandingPage extends SecurePage {

  private readonly BACK_TO_EXIT_ACTION_PRIORITY = 102;
  private readonly DEFAULT_CACHE_TTL = 4320; //72 hours
  private removeBackButtonAction;
  private exitTimerPromise;

  public readonly greeting = `Hello, ${this.session.user.firstName}`;
  public readonly chartColors = this.CONSTANTS.CHART.COLORS;

  public invoiceSummary = new InvoiceSummary();
  public billingCompany = new Company();
  public scheduledPaymentsCount = 0;
  public chartDisplay: any = {};
  public chart: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private invoiceProvider: InvoiceProvider) {
    super("Landing");
  }

  ionViewWillEnter() {
    this.invoiceProvider.current(this.session.user.billingCompany.accountId)
      .subscribe((invoiceSummary: InvoiceSummary) => {
        this.invoiceSummary = invoiceSummary;
      });
  }

  public goToCards() {

  }

  public goToDrivers() {

  }

  public goToMakePayment() {

  }

  public goToTransactionActivity() {

  }
}
