import * as _ from "lodash";
import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentSelectionOption } from "./../../../providers/payment-service";
import { UserPaymentAmount, UserPaymentAmountType, UserPayment } from "../../../models/user-payment";
import { WexPlatform } from "../../../providers";
import { BankAccount } from "@angular-wex/models";
import { StateEmitter, Reactive, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";
import { Value } from "../../../decorators/value";

export type AddPaymentSelectionNavParams = keyof {
  listType,
  items,
  selectedItem$
};

export namespace AddPaymentSelectionNavParams {

  export const ListType: AddPaymentSelectionNavParams = "listType";
  export const Items: AddPaymentSelectionNavParams = "items";
  export const SelectedItem$: AddPaymentSelectionNavParams = "selectedItem$";
}

@Component({
  selector: "page-add-payment-selection",
  templateUrl: "add-payment-selection.html"
})
@Reactive()
export class AddPaymentSelectionPage extends SecurePage {

  @Value("PAGES.PAYMENTS.ADD.LABELS") private readonly PAYMENT_LABELS: any;

  @EventSource() private onSubmit$: Observable<any>;

  @StateEmitter() private pageTitle$: Subject<string>;
  @StateEmitter() private instructionalText$: Subject<string>;
  @StateEmitter() private isSubmitEnabled$: Subject<boolean>;
  @StateEmitter() private isOtherAmountSelected$: Subject<boolean>;
  @StateEmitter() private isBankAccount$: Subject<boolean>;
  @StateEmitter() private isPaymentAmount$: Subject<boolean>;

  @StateEmitter.From("navParams.data." + AddPaymentSelectionNavParams.SelectedItem$)
  private selectedItem$: Subject<PaymentSelectionOption>;

  @StateEmitter.Alias({ path: "selectedItem$.value", mergeUpdates: true })
  public /** @template */ selectedItemValue$: Observable<number>;

  @StateEmitter.Alias("navParams.data." + AddPaymentSelectionNavParams.SelectedItem$)
  private chosenItem$: Subject<PaymentSelectionOption>;

  @StateEmitter.Alias("navParams.data." + AddPaymentSelectionNavParams.ListType)
  private listType$: Observable<keyof UserPayment>;

  @StateEmitter.Alias("navParams.data." + AddPaymentSelectionNavParams.Items)
  private items$: Observable<PaymentSelectionOption[]>;

  constructor(injector: Injector, navCtrl: NavController, public navParams: NavParams, public platform: WexPlatform) {
    super({ pageName: "Payments.Add.Selection", trackView: false }, injector);

    this.listType$.subscribe(listType => {
      this.isBankAccount$.next(listType === "bankAccount");
      this.isPaymentAmount$.next(listType === "amount");

      // Set the page title and instructional test
      this.pageTitle$.next(this.CONSTANTS.LABELS[listType]);
      this.instructionalText$.next(_.get<string>(this.CONSTANTS.INSTRUCTIONAL_TEXT, listType, ""));
    });

    // Make sure that the selected item is one of the items in the list if this is a payment selection
    this.isPaymentAmount$.asObservable()
      .filter(Boolean)
      .flatMap(() => Observable.combineLatest(this.items$, this.selectedItem$))
      .take(1)
      .subscribe((args: [UserPaymentAmount[], UserPaymentAmount]) => {
        let [items, selectedItem] = args;
        this.selectedItem$.next(Object.assign(_.find(items, { type: selectedItem.type }), selectedItem));
      });

    this.isBankAccount$.asObservable()
      .filter(Boolean)
      .flatMap(() => Observable.combineLatest(this.selectedItem$, this.chosenItem$))
      .subscribe((args: [BankAccount, BankAccount]) => {
        let [selectedItem, initialItem] = args;
        this.isSubmitEnabled$.next(selectedItem.details.id !== initialItem.details.id);
      });

    this.isPaymentAmount$.asObservable()
      .filter(Boolean)
      .flatMap(() => Observable.combineLatest(this.selectedItem$, this.chosenItem$))
      .subscribe((args: [UserPaymentAmount, UserPaymentAmount]) => {
        let [selectedItem, initialItem] = args;
        this.isSubmitEnabled$.next(!_.isNaN(selectedItem.value) && selectedItem.value !== 0 && selectedItem.value !== initialItem.value);
        this.isOtherAmountSelected$.next(this.isOtherAmount(selectedItem));
      });

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
}
