import * as _ from "lodash";
import * as moment from "moment";
import { Observable, Subject } from "rxjs";
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
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
@Reactive()
@TabPage()
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  @EventSource() onAddPayment$: Observable<any>;

  @StateEmitter() private checkingMakePaymentAvailability$: Subject<boolean>;
  @StateEmitter() private minPaymentDueDate$: Subject<string>;

  @StateEmitter.Alias("session$.invoiceSummary")
  private invoiceSummary$: Observable<InvoiceSummary>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private alertController: WexAlertController,
    injector: Injector
  ) {
    super({ pageName: "Payments", listDataField: Session.Field.Payments }, injector, [Session.Field.InvoiceSummary]);

    this.onViewWillEnter$
      .flatMap(() => this.invoiceSummary$.take(1))
      .subscribe((invoiceSummary) => {
        this.minPaymentDueDate$.next(_.template(this.CONSTANTS.payNowSection.on)({
          dueDate: moment(invoiceSummary.paymentDueDate).format("MMMM Do, YYYY")
        }));
      });

    this.onAddPayment$
      .flatMap(() => this.canMakePayment())
      .subscribe(() => this.app.getRootNav().push(AddPaymentPage), (availability: MakePaymentAvailability) => {
        // get the reason that the user can't make a payment
        let unavailabilityReason = _.reduce<any, string>(availability.details, (acc, isReason, reason) => isReason ? reason : acc, "");
        let unavailabilityReasonMessage = _.get<string>(this.CONSTANTS.UNAVAILABILITY_REASONS, unavailabilityReason, this.CONSTANTS.UNAVAILABILITY_REASONS.default);

        this.alertController.alert(unavailabilityReasonMessage);
        this.trackAnalyticsEvent(unavailabilityReason);

        this.trackAnalyticsEvent("addPayment");
      });

    this.onItemSelected$.subscribe(payment => this.navCtrl.push(PaymentsDetailsPage, { payment }));
  }

  private canMakePayment(): Observable<MakePaymentAvailability> {
    this.checkingMakePaymentAvailability$.next(true);

    return this.sessionCache.getUpdatedField$(Session.Field.MakePaymentAvailability)
      .flatMap((availability: MakePaymentAvailability) => {
        if (!availability.details.makePaymentAllowed) {
          return Observable.throw(availability);
        }
        else {
          return Observable.of(availability);
        }
      })
      .finally(() => this.checkingMakePaymentAvailability$.next(false));
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
}
