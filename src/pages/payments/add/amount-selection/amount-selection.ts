import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../../secure-page";
import { PaymentSelectionOption } from "../../../../providers/payment-service";
import { UserPaymentAmount, UserPaymentAmountType } from "../../../../models/user-payment";
import { WexPlatform } from "../../../../providers";
import { StateEmitter, Reactive, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";
import { Value } from "../../../../decorators/value";
import { ViewDidEnter, ViewWillLeave } from "angular-rxjs-extensions-ionic";

export type AddPaymentSelectionNavParams = keyof {
  items,
  selectedItem$
};

export namespace AddPaymentSelectionNavParams {
  export const Items: AddPaymentSelectionNavParams = "items";
  export const SelectedItem$: AddPaymentSelectionNavParams = "selectedItem$";
}

@Component({
  selector: "page-amount-selection",
  templateUrl: "amount-selection.html"
})
@Reactive()
export class AmountSelectionPage extends SecurePage {

  @Value("PAGES.PAYMENTS.ADD.LABELS") private readonly PAYMENT_LABELS: any;

  @EventSource() private onSubmit$: Observable<any>;

  @StateEmitter() private isSubmitEnabled$: Subject<boolean>;
  @StateEmitter() private isOtherAmountSelected$: Subject<boolean>;
  @StateEmitter({ initialValue: false }) private focusOnOtherAmount$: Subject<boolean>;
  @ViewDidEnter() private onViewDidEnter$: Observable<void>;
  @ViewWillLeave() private onViewWillLeave$: Observable<void>;

  @StateEmitter.From("navParams.data." + AddPaymentSelectionNavParams.SelectedItem$)
  private selectedItem$: Subject<PaymentSelectionOption>;

  @StateEmitter.Alias({ path: "selectedItem$.value", mergeUpdates: true })
  public /** @template */ selectedItemValue$: Observable<number>;

  @StateEmitter.Alias("navParams.data." + AddPaymentSelectionNavParams.SelectedItem$)
  private chosenItem$: Subject<PaymentSelectionOption>;

  @StateEmitter.Alias("navParams.data." + AddPaymentSelectionNavParams.Items)
  private items$: Observable<PaymentSelectionOption[]>;

  constructor(injector: Injector, navCtrl: NavController, public navParams: NavParams, public platform: WexPlatform) {
    super({ pageName: "Payments.Add.Selection", trackView: false }, injector);

    // Make sure that the selected item is one of the items in the list if this is a payment selection
    Observable.combineLatest(this.items$, this.selectedItem$)
      .take(1)
      .subscribe((args: [UserPaymentAmount[], UserPaymentAmount]) => {
        let [items, selectedItem] = args;
        this.selectedItem$.next(Object.assign(_.find(items, { type: selectedItem.type }), selectedItem));
      });

    Observable.combineLatest(this.selectedItem$, this.chosenItem$)
      .flatMap((args: [UserPaymentAmount, UserPaymentAmount]) => {
        let [selectedItem, initialItem] = args;
        this.isSubmitEnabled$.next(!_.isNaN(selectedItem.value) && selectedItem.value !== 0 && selectedItem.value !== initialItem.value);
        this.isOtherAmountSelected$.next(this.isOtherAmount(selectedItem));
        return this.onViewDidEnter$;
      })
      .flatMapTo(this.isOtherAmountSelected$)
      .delay(500)
      .subscribe((isOtherAmountSelected) => this.focusOnOtherAmount$.next(isOtherAmountSelected));
    this.onViewWillLeave$
      .subscribe(() => this.isOtherAmountSelected$.next(false));
    this.onSubmit$
      .flatMap(() => this.selectedItem$.asObservable().take(1))
      .subscribe((selectedItem) => {
        this.chosenItem$.next(selectedItem);

        navCtrl.pop();
      });
  }

  public getPaymentAmountLabel(item: UserPaymentAmount): string {
    return this.PAYMENT_LABELS[item.type];
  }

  public isOtherAmount(amount: UserPaymentAmount): boolean {
    return amount.type === UserPaymentAmountType.OtherAmount;
  }

  public select(item) {
    this.selectedItem$.next(item);
  }
}
