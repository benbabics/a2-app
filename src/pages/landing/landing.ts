import * as _ from "lodash";
import { InvoiceProvider } from "../../providers";
import { Component } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Company, InvoiceSummary } from "../../models";
import { SecurePage } from "../secure-page";
import { OptionsPopoverPage } from "./options-popover/options-popover";

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
export class LandingPage extends SecurePage {

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private invoiceProvider: InvoiceProvider,
    private popoverCtrl: PopoverController
  ) {
    super("Landing");
  }

  ionViewDidEnter() {  }

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
    this.invoiceProvider.current(this.session.details.user.billingCompany.details.accountId)
      .subscribe((invoiceSummary: InvoiceSummary) => {
        this.invoiceSummary = invoiceSummary;

        this.chartDisplay = this.createChartDisplayConfiguration();
        this.chart = this.createChartConfiguration();
      });
  }

  public onShowOptions($event) {
    let popover = this.popoverCtrl.create(OptionsPopoverPage);

    popover.present({ ev: $event });
  }
}
