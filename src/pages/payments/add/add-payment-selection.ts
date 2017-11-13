import { Component, Injector } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SecurePage } from "../../secure-page";
import { PaymentSelectionOption } from "./../../../providers/payment-service";
import { UserPaymentAmount, UserPaymentAmountType, UserPayment } from "../../../models/user-payment";
import { WexPlatform } from "../../../providers";
import { BankAccount } from "@angular-wex/models";
import * as _ from "lodash";
import { StateEmitter, Reactive, EventSource } from "angular-rxjs-extensions";
import { Subject, Observable } from "rxjs";
import { Value } from "../../../decorators/value";

export type AddPaymentSelectionNavParams = keyof {
  items,
  selectedItem,
  userPayment$
};

export namespace AddPaymentSelectionNavParams {

  export const Items: AddPaymentSelectionNavParams = "items";
  export const SelectedItem: AddPaymentSelectionNavParams = "selectedItem";
  export const UserPayment$: AddPaymentSelectionNavParams = "userPayment$";
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
  @StateEmitter({ initialValue: false }) public /** @template */ isSubmitEnabled$: Subject<boolean>;
  @StateEmitter() public /** @template */  isOtherAmountSelected$: Subject<boolean>;
  @StateEmitter() private items$: Subject<PaymentSelectionOption[]>;
  @StateEmitter() private selectedItem$: Subject<PaymentSelectionOption>;

  @StateEmitter.Alias(`navParams.data.${AddPaymentSelectionNavParams.UserPayment$}`)
  private userPayment$: Subject<UserPaymentAmount>;

  @StateEmitter.Alias({ path: "selectedItem$.value", mergeUpdates: true })
  public /** @template */ selectedItemValue$: Observable<number>;

  private listType$: Observable<keyof UserPayment>;
  private initialItem$: Observable<PaymentSelectionOption>;

  constructor(injector: Injector, navCtrl: NavController, public navParams: NavParams, public platform: WexPlatform) {
    super({ pageName: "Payments.Add.Selection", trackView: false }, injector);

    // Set the initial item
    this.initialItem$ = Observable.of(navParams.get(AddPaymentSelectionNavParams.SelectedItem)).shareReplay(1);

    // Create an observable for the list type
    this.listType$ = this.initialItem$
      .map((initialItem) => {
        if (this.isPaymentAmount(initialItem)) {
          return "amount";
        }
        else if (this.isBankAccount(initialItem)) {
          return "bankAccount";
        }

        return undefined;
      }).shareReplay(1);

    // Clone all of the items
    this.items$.next(this.initialItems.map(item => _.clone(item)));

    // Set the selected item
    this.items$.asObservable()
      .take(1)
      .subscribe(items => this.selectedItem$.next(_.first(items)));

    // Set the page title
    this.listType$.subscribe(listType => this.pageTitle$.next(this.CONSTANTS.LABELS[listType]));

    Observable.combineLatest(this.selectedItem$, this.initialItem$).subscribe((args) => {
      let [selectedItem, initialItem] = args;
      let isSubmitEnabled: boolean = true;

      if (this.isPaymentAmount(selectedItem)) {
        isSubmitEnabled = selectedItem.value !== (<UserPaymentAmount>initialItem).value;
      }
      else if (this.isBankAccount(selectedItem)) {
        isSubmitEnabled = selectedItem.details.id !== (<BankAccount>initialItem).details.id;
      }

      this.isSubmitEnabled$.next(isSubmitEnabled);
      this.isOtherAmountSelected$.next(this.isCustomPaymentAmount(selectedItem));
    });

    this.onSubmit$
      .flatMap(() => Observable.combineLatest(this.selectedItem$, this.userPayment$, this.listType$).take(1))
      .subscribe((args) => {
        let [selectedItem, userPayment, listType] = args;

        // Update the UserPayment with the selected item
        this.userPayment$.next(Object.assign(userPayment, { [listType]: selectedItem }));

        navCtrl.pop();
      });
  }

  public getPaymentAmountLabel(item: UserPaymentAmount): string {
    return this.PAYMENT_LABELS[item.type];
  }

  public isBankAccount(selectedItem: PaymentSelectionOption): selectedItem is BankAccount {
    return selectedItem instanceof BankAccount;
  }

  public isPaymentAmount(selectedItem: PaymentSelectionOption): selectedItem is UserPaymentAmount {
    return !(selectedItem instanceof BankAccount);
  }

  public isCustomPaymentAmount(selectedItem: PaymentSelectionOption): selectedItem is UserPaymentAmount {
    return this.isPaymentAmount(selectedItem) && selectedItem.type === UserPaymentAmountType.OtherAmount;
  }

  private get initialItems(): PaymentSelectionOption[] {
    return this.navParams.get(AddPaymentSelectionNavParams.Items);
  }

  private getInitialItem(listItem: PaymentSelectionOption): PaymentSelectionOption {
    
  }
}
