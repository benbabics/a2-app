import * as _ from "lodash";
import * as moment from "moment";
import { Observable } from "rxjs";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController, App } from "ionic-angular";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Payment, PaymentStatus, MakePaymentAvailability } from "@angular-wex/models";
import { PaymentsDetailsPage } from "./details/payments-details";
import { Session } from "../../models";
import { AddPaymentPage } from "./add/add-payment";
import { TabPage } from "../../decorators/tab-page";
import { InvoiceSummary } from "@angular-wex/models";
import { WexAlertController } from "../../components/wex-alert-controller/wex-alert-controller";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
@Reactive()
@TabPage()
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  @StateEmitter.Alias("session$.invoiceSummary")
  private invoiceSummary$: Observable<InvoiceSummary>;

  public checkingMakePaymentAvailability: boolean = false;

  public minPaymentDueDate: string;
  public invoiceSummary: InvoiceSummary;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private alertController: WexAlertController,
    injector: Injector
  ) {
    super("Payments", Session.Field.Payments, injector, null, [Session.Field.InvoiceSummary]);
  }

  ionViewWillEnter() {
    this.invoiceSummary$.subscribe((invoiceSummary) => {
      this.minPaymentDueDate = _.template(this.CONSTANTS.payNowSection.on)({
        dueDate: moment(invoiceSummary.paymentDueDate).format("MMMM Do, YYYY")
      });
      this.invoiceSummary = invoiceSummary;
    });
    super.ionViewWillEnter();
  }

  private canMakePayment(): Promise<MakePaymentAvailability | undefined> {
    this.checkingMakePaymentAvailability = true;

    return this.sessionCache.update$(Session.Field.MakePaymentAvailability)
      .map(session => session.makePaymentAvailability)
      .toPromise()
      .then((availability: MakePaymentAvailability) => {
        if (!availability.details.makePaymentAllowed) {
          return Promise.reject(availability);
        }
      })
      .finally(() => this.checkingMakePaymentAvailability = false);
  }

  protected groupItems(payments: Payment[]): GroupedList<Payment> {
    return StaticListPage.defaultItemGroup<Payment, Payment.Details>(payments, "status", PaymentsPage.PAYMENT_STATUSES);
  }

  protected sortItems(payments: Payment[]): Payment[] {
    return StaticListPage.defaultItemSort<Payment, Payment.Details>(payments, "scheduledDate", "desc");
  }

  public getStatus(payment: Payment): string {
    return payment.details.status === PaymentStatus.COMPLETE ? this.CONSTANTS.itemStatus.completed : this.CONSTANTS.itemStatus.scheduled;
  }

  public goToDetailPage(payment: Payment) {
    this.navCtrl.push(PaymentsDetailsPage, { payment });
  }

  public addPayment() {
    this.canMakePayment()
      .then(() => {
        this.app.getRootNav().push(AddPaymentPage);
      })
      .catch((availability: MakePaymentAvailability) => {
        // get the reason that the user can't make a payment
        let unavailabilityReason = _.reduce<any, string>(availability.details, (acc, isReason, reason) => isReason ? reason : acc, "");
        let unavailabilityReasonMessage = _.get<string>(this.CONSTANTS.UNAVAILABILITY_REASONS, unavailabilityReason, this.CONSTANTS.UNAVAILABILITY_REASONS.default);

        this.alertController.alert(unavailabilityReasonMessage);
        this.trackAnalyticsEvent(unavailabilityReason);
      });

    this.trackAnalyticsEvent("addPayment");
  }
}
