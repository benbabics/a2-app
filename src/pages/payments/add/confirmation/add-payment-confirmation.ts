import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { Payment } from "@angular-wex/models";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Observable, Subject } from "rxjs";
import * as _ from "lodash";

export type AddPaymentConfirmationNavParams = keyof {
  payment: Payment,
  isEditingPayment: boolean
};

export namespace AddPaymentConfirmationNavParams {
  export const Payment: AddPaymentConfirmationNavParams = "payment";
  export const IsEditingPayment: AddPaymentConfirmationNavParams = "isEditingPayment";
}

@Component({
  selector: "page-add-payment-confirmation",
  templateUrl: "add-payment-confirmation.html"
})
@Reactive()
export class AddPaymentConfirmationPage extends SecurePage {

  public readonly DATE_FORMAT: string = "MMMM D, YYYY";

  @EventSource() private onFinish$: Observable<any>;

  @StateEmitter() private pageTitle$: Subject<string>;

  @StateEmitter.Alias("navParams.data." + AddPaymentConfirmationNavParams.Payment)
  public /** @template */ payment$: Observable<Payment>;

  @StateEmitter.Alias("navParams.data." + AddPaymentConfirmationNavParams.IsEditingPayment)
  public /** @template */ isEditingPayment$: Observable<boolean>;

  constructor(injector: Injector, navCtrl: NavController, public navParams: NavParams) {
    super({ pageName: "Payments.Add.Confirmation", trackView: false }, injector);

    this.isEditingPayment$.subscribe((isEditingPayment) => {
      let scheduledOrUpdated = isEditingPayment ? this.CONSTANTS.title.updated : this.CONSTANTS.title.scheduled;

      this.pageTitle$.next(_.template(this.CONSTANTS.title.template)({ scheduledOrUpdated }));
    });

    this.onFinish$.subscribe(() => {
      navCtrl.pop({ direction: "forward" });
      this.trackAnalyticsEvent("confirmationOk");
    });
  }
}
