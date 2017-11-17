import * as _ from "lodash";
import { NavParams, NavController, ViewController } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Payment, User } from "@angular-wex/models";
import { AddPaymentPage } from "../add/add-payment";
import { PaymentProvider } from "@angular-wex/api-providers";
import { WexAlertController } from "../../../components/wex-alert-controller/wex-alert-controller";
import { Session } from "../../../models/session";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Observable, Subject } from "rxjs";

export type PaymentsDetailsNavParams = keyof {
  payment,
  multiplePending
};

export namespace PaymentsDetailsNavParams {
  export const Payment: PaymentsDetailsNavParams = "payment";
  export const MultiplePending: PaymentsDetailsNavParams = "multiplePending";
}

@Component({
  selector: "page-payments-details",
  templateUrl: "payments-details.html"
})
@Reactive()
export class PaymentsDetailsPage extends DetailsPage {

  public readonly DATE_FORMAT: string = "MMM D, YYYY";

  @EventSource() private onCancelPayment$: Observable<void>;
  @EventSource() private onEditPayment$: Observable<void>;

  @StateEmitter() private headerLabel$: Subject<string>;
  @StateEmitter() private multiplePending$: Subject<boolean>;
  @StateEmitter() private isCanceling$: Subject<boolean>;

  @StateEmitter.Alias("navParams.data." + PaymentsDetailsNavParams.Payment)
  private payment$: Observable<Payment>;

  @StateEmitter.Alias("payment$.isComplete")
  private isCompleted$: Observable<boolean>;

  @StateEmitter.Alias("payment$.isScheduled")
  private isScheduled$: Observable<boolean>;

  constructor(
    public navParams: NavParams,
    paymentProvider: PaymentProvider,
    wexAlertController: WexAlertController,
    navCtrl: NavController,
    viewCtrl: ViewController,
    injector: Injector
  ) {
    super("Payments.Details", injector, [Session.Field.Payments]);

    this.isScheduled$
      .filter(Boolean)
      .subscribe(() => this.headerLabel$.next(this.CONSTANTS.header.scheduled));

    this.isCompleted$
      .filter(Boolean)
      .subscribe(() => this.headerLabel$.next(this.CONSTANTS.header.completed));

    this.sessionCache.getField$<Payment[]>(Session.Field.Payments)
      .subscribe(payments => this.multiplePending$.next(_.filter(payments, payment => payment.isScheduled).length > 1));

    this.onCancelPayment$
      .flatMap(() => wexAlertController.confirmation$(this.CONSTANTS.cancelPaymentConfirmation))
      .filter((confirmed) => {
        if (confirmed) {
          this.trackAnalyticsEvent("paymentCancelYes");
          this.isCanceling$.next(true);
        }
        else {
          this.trackAnalyticsEvent("paymentCancelPrompt");
        }

        return confirmed;
      })
      .flatMap(() => Observable.combineLatest(this.payment$, this.sessionCache.getField$<User>(Session.Field.User)).take(1))
      .flatMap((args) => {
        let [payment, user] = args;
        return paymentProvider.cancelPayment(user.billingCompany.details.accountId, payment.details.id)
          .catch(() => Observable.empty());
      })
      .flatMap(() => Observable.combineLatest(this.payment$, this.sessionCache.getField$<Payment[]>(Session.Field.Payments)).take(1))
      .finally(() => this.isCanceling$.next(false))
      .subscribe((args) => {
        let [payment, payments] = args;
        this.sessionCache.updateValue(Session.Field.Payments, _.filter(payments, curPayment => curPayment.details.id !== payment.details.id));
        navCtrl.pop();
      });

    this.onEditPayment$
      .flatMap(() => this.payment$.take(1))
      .flatMap(payment => navCtrl.push(AddPaymentPage, { payment }))
      .map(() => navCtrl.removeView(viewCtrl))
      .subscribe(() => this.trackAnalyticsEvent("paymentEdit"));
  }
}
