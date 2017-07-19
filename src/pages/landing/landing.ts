import { GoogleAnalytics } from '@ionic-native/google-analytics';
import * as _ from "lodash";
import { SessionManager, NavBarController } from "../../providers";
import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Company, InvoiceSummary, Payment } from "@angular-wex/models";
import { Session } from "../../models";
import { SecurePage } from "../secure-page";
import { OptionsPopoverPage } from "./options-popover/options-popover";
import { InvoiceProvider, BrandProvider } from "@angular-wex/api-providers";

interface ChartDisplayConfig {
  [list: string]: any[];
}

interface ChartConfig {
  options: object;
  labels: string[];
  colors: object[];
  data: any[];
}

@Component({
  selector: "page-landing",
  templateUrl: "landing.html"
})
export class LandingPage extends SecurePage implements OnInit {

  private readonly BACK_TO_EXIT_ACTION_PRIORITY = 102;
  private readonly DEFAULT_CACHE_TTL = 4320; //72 hours
  private removeBackButtonAction;
  private exitTimerPromise;

  public readonly chartColors = this.CONSTANTS.CHART.COLORS;

  public invoiceSummary;
  public billingCompany = new Company();
  public scheduledPaymentsCount = 0;
  public chartDisplay: ChartDisplayConfig;
  public chart: ChartConfig;
  public brandLogoData: string;

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams,
    private invoiceProvider: InvoiceProvider,
    private popoverCtrl: PopoverController,
    private brandProvider: BrandProvider,
    private navBarController: NavBarController,
    private googleAnalytics: GoogleAnalytics
  ) {
    super("Landing", sessionManager);
  }

  ngOnInit() {
    this.googleAnalytics.trackView("LandingPage");
  }

  private createChartDisplayConfiguration(): ChartDisplayConfig {
    let datasets: ChartDisplayConfig = { collection: [], left: [], right: [] },
        dataIds: InvoiceSummary.Field[] = ["pendingAmount", "unbilledAmount", "availableCredit", "billedAmount"],
        requiredDataIds: InvoiceSummary.Field[] = ["availableCredit"];

    dataIds.forEach((id: string) => {
      if (this.invoiceSummary.details[id] > 0 || _.includes(requiredDataIds, id)) {
        datasets.collection.push({
          id: id,
          label: this.CONSTANTS[id],
          color: { backgroundColor: this.chartColors[id] },
          data: this.invoiceSummary.details[id]
        });
      }
    });

    datasets.right = _.clone(datasets.collection);
    datasets.left = datasets.right.splice(0, Math.ceil(datasets.right.length / 2));

    return datasets;
  }

  private createChartConfiguration(): ChartConfig {
    let availableCreditData: any = _.find(this.chartDisplay.collection, { id: "availableCredit" });

    if (!this.invoiceSummary.isAnyCreditAvailable) {
      return {
        options: this.CONSTANTS.CHART.OPTIONS,
        labels: [availableCreditData.label],
        colors: [{ backgroundColor: this.chartColors.availableCreditNegative }],
        data: [this.CONSTANTS.CHART.CONSTANTS.negativeCreditData]
      };
    }

    if (this.invoiceSummary.isAllCreditAvailable) {
      return {
        options: this.CONSTANTS.CHART.OPTIONS,
        labels: [availableCreditData.label],
        colors: [availableCreditData.color],
        data: [availableCreditData.data]
      };
    }

    return {
      options: this.CONSTANTS.CHART.OPTIONS,
      labels: _.map<any, string>(this.chartDisplay.collection, "label"),
      colors: _.map<any, object>(this.chartDisplay.collection, "color"),
      data: _.map<any, any>(this.chartDisplay.collection, "data")
    };
  }

  ionViewWillEnter() {
    this.invoiceProvider.current(this.session.user.billingCompany.details.accountId)
      .subscribe((invoiceSummary: InvoiceSummary) => {
        this.invoiceSummary = invoiceSummary;

        this.chartDisplay = this.createChartDisplayConfiguration();
        this.chart = this.createChartConfiguration();
      });

    this.brandProvider.logo(this.session.user.details.brand)
      .subscribe((brandLogoData: string) => this.brandLogoData = brandLogoData);

    this.sessionManager.cache.requestSessionDetail(Session.Field.Payments)
      .subscribe((payments: Payment[]) => {
        let scheduledCount = payments.filter(payment => payment.isScheduled).length;

        // Update the payment tab badge with the scheduled count
        this.navBarController.paymentsBadgeText = scheduledCount > 0 ? String(scheduledCount) : "";
      });
  }

  public onShowOptions($event) {
    let popover = this.popoverCtrl.create(OptionsPopoverPage);

    popover.present({ ev: $event });
  }
}
