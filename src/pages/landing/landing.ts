import * as _ from "lodash";
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

  public readonly chartColors = this.CONSTANTS.CHART.COLORS;

  public greeting;
  public invoiceSummary;
  public billingCompany = new Company();
  public scheduledPaymentsCount = 0;
  public chartDisplay: any = {};
  public chart: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private invoiceProvider: InvoiceProvider) {
    super("Landing");
  }

  ionViewDidEnter() {
    this.greeting = `Hello, ${this.session.user.firstName}`;
  }

  private createChartDisplayConfiguration(): any {
    let datasets = { collection: [], left: [], right: [] },
        dataIds = ["pendingAmount", "unbilledAmount", "availableCredit", "billedAmount"],
        requiredDataIds = ["availableCredit"];

    dataIds.forEach((id: string) => {
      if (this.invoiceSummary[id] > 0 || _.includes(requiredDataIds, id)) {
        datasets.collection.push({
          id: id,
          label: this.CONSTANTS[id],
          color: this.chartColors[id],
          data: this.invoiceSummary[id]
        });
      }
    });

    datasets.right = _.clone(datasets.collection);
    datasets.left = datasets.right.splice(0, Math.ceil(datasets.right.length / 2));

    return datasets;
  }

  private createChartConfiguration(): any {
    let availableCreditData: any = _.find(this.chartDisplay.collection, { id: "availableCredit" });

    if (!this.invoiceSummary.isAnyCreditAvailable) {
      return {
        options: this.CONSTANTS.CHART.OPTIONS,
        labels: [availableCreditData.label],
        colors: [this.chartColors.availableCreditNegative],
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
      labels: _.map(this.chartDisplay.collection, "label"),
      colors: _.map(this.chartDisplay.collection, "color"),
      data: _.map(this.chartDisplay.collection, "data")
    };
  }

  ionViewWillEnter() {
    this.invoiceProvider.current(this.session.user.billingCompany.accountId)
      .subscribe((invoiceSummary: InvoiceSummary) => {
        this.invoiceSummary = invoiceSummary;

        this.chartDisplay = this.createChartDisplayConfiguration();
        this.chart = this.createChartConfiguration();
      });
  }
}
