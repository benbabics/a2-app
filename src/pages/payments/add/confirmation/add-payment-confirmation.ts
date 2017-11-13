import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { Payment } from "@angular-wex/models";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Observable } from "rxjs";

export type AddPaymentConfirmationNavParams = keyof {
  payment: Payment
};

export namespace AddPaymentConfirmationNavParams {
  export const Payment: AddPaymentConfirmationNavParams = "payment";
}

@Component({
  selector: "page-add-payment-confirmation",
  templateUrl: "add-payment-confirmation.html"
})
@Reactive()
export class AddPaymentConfirmationPage extends SecurePage {

  public readonly DATE_FORMAT: string = "MMMM D, YYYY";

  @EventSource() private onFinish$: Observable<any>;

  @StateEmitter.Alias("navParams.data." + AddPaymentConfirmationNavParams.Payment)
  public /** @template */ payment$: Observable<Payment>;

  constructor(injector: Injector, navCtrl: NavController, public navParams: NavParams) {
    super({ pageName: "Payments.Add.Confirmation", trackView: false }, injector);

    this.onFinish$.subscribe(() => {
      navCtrl.pop({ direction: "forward" });
      this.trackAnalyticsEvent("confirmationOk");
    });
  }
}
