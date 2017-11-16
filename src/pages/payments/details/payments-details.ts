import * as _ from "lodash";
import { NavParams, NavController, App, ViewController } from "ionic-angular";
import { Component, Injector } from "@angular/core";
import { DetailsPage } from "../../details-page";
import { Payment, User } from "@angular-wex/models";
import { WexPlatform } from "../../../providers";
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

  @StateEmitter.Alias("navParams.data." + PaymentsDetailsNavParams.Payment)
  private payment$: Observable<Payment>;

  @StateEmitter.Alias("payment$.isComplete")
  private isCompleted$: Observable<boolean>;

  @StateEmitter.Alias("payment$.isScheduled")
  private isScheduled$: Observable<boolean>;

  public isCanceling: boolean;

  constructor(
    public navParams: NavParams,
    public platform: WexPlatform,
    public paymentProvider: PaymentProvider,
    public wexAlertController: WexAlertController,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public app: App,
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
      .subscribe(payments => this.multiplePending$.next(payments.filter(payment => payment.isScheduled).length > 1));

    this.onCancelPayment$
      .flatMap(() => this.wexAlertController.confirmation(this.CONSTANTS.cancelPaymentConfirmation))
      .map(() => this.isCanceling = true)
      .flatMap(() => Observable.combineLatest(this.payment$, this.sessionCache.getField$<User>(Session.Field.User)).take(1))
      .flatMap((args) => {
        let [payment, user] = args;
        return paymentProvider.cancelPayment(user.billingCompany.details.accountId, payment.details.id);
      })
      .flatMap(() => this.sessionCache.getField$<Payment[]>(Session.Field.Payments).take(1))
      .map(payments => this.sessionCache.updateValue(Session.Field.Payments, _.remove(payments, payment => payment.details.id === payment.details.id)))
      .finally(() => this.isCanceling = false)
      .subscribe(() => {
        navCtrl.pop();
        this.trackAnalyticsEvent("paymentCancelYes");
      }, () => this.trackAnalyticsEvent("paymentCancelPrompt"));

    this.onEditPayment$.subscribe(() => {
      this.navCtrl.push(AddPaymentPage, { payment: this.payment })
        .then(() => this.navCtrl.removeView(this.viewCtrl));
      this.trackAnalyticsEvent("paymentEdit");
    });
  }
}
