import * as _ from "lodash";
import { Observable } from "rxjs";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController, ModalController, Modal } from "ionic-angular";
import { StaticListPage, GroupedList, FetchOptions } from "../static-list-page";
import { Payment, PaymentStatus, MakePaymentAvailability } from "@angular-wex/models";
import { PaymentsDetailsPage } from "./details/payments-details";
import { Session } from "../../models";
import { AddPaymentPage } from "./add/add-payment";
import { Dialogs } from "@ionic-native/dialogs";
import { TabPage } from "../../decorators/tab-page";

@TabPage()
@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  protected readonly listGroupDisplayOrder: string[] = PaymentsPage.PAYMENT_STATUSES;
  public readonly dividerLabels: string[] = PaymentsPage.PAYMENT_STATUSES.map(PaymentStatus.displayName);

  private makePaymentModal: Modal;

  public checkingMakePaymentAvailability: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private dialogs: Dialogs,
    injector: Injector
  ) {
    super("Payments", injector);
  }

  ionViewDidLeave() {
    if (this.makePaymentModal) {
      this.makePaymentModal.dismiss();
    }
  }

  private canMakePayment(): Promise<MakePaymentAvailability | undefined> {
    this.checkingMakePaymentAvailability = true;

    return this.sessionManager.cache.getSessionDetail(Session.Field.MakePaymentAvailability, { forceRequest: true })
      .toPromise()
      .then((availability: MakePaymentAvailability) => {
        if (!availability.details.makePaymentAllowed) {
          return Promise.reject(availability);
        }
      })
      .finally(() => this.checkingMakePaymentAvailability = false);
  }

  protected fetch(options?: FetchOptions): Observable<Payment[]> {
    return this.sessionManager.cache.getSessionDetail(Session.Field.Payments, options);
  }

  protected groupItems(payments: Payment[]): GroupedList<Payment> {
    return StaticListPage.defaultItemGroup<Payment, Payment.Details>(payments, "status", PaymentsPage.PAYMENT_STATUSES);
  }

  protected sortItems(payments: Payment[]): Payment[] {
    return StaticListPage.defaultItemSort<Payment, Payment.Details>(payments, "id", "asc");
  }

  public goToDetailPage(payment: Payment) {
    this.navCtrl.push(PaymentsDetailsPage, { payment });
  }

  public addPayment() {
    if (!this.makePaymentModal) {
      this.canMakePayment()
        .then(() => {
          this.makePaymentModal = this.modalController.create(AddPaymentPage);

          this.makePaymentModal.onDidDismiss(() => this.makePaymentModal = null);
          this.makePaymentModal.present();
        })
        .catch((availability: MakePaymentAvailability) => {
          // get the reason that the user can't make a payment
          let unavailabilityReason = _.reduce<any, string>(availability.details, (acc, isReason, reason) => isReason ? reason : acc, "");
          let unavailabilityReasonMessage = _.get<string>(this.CONSTANTS.UNAVAILABILITY_REASONS, unavailabilityReason, this.CONSTANTS.UNAVAILABILITY_REASONS.default);

          this.dialogs.alert(unavailabilityReasonMessage);
        });
    }
  }
}
