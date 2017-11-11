import * as _ from "lodash";
import * as moment from "moment";
import { Component, Injector, ViewChild } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { SecurePage } from "../../secure-page";
import { BankAccount, Payment } from "@angular-wex/models";
import { PaymentService, PaymentSelectionOption } from "./../../../providers/payment-service";
import { AddPaymentSelectionPage } from "./add-payment-selection";
import { UserPayment, UserPaymentAmount } from "../../../models";
import { Value } from "../../../decorators/value";
import { AddPaymentConfirmationPage } from "./confirmation/add-payment-confirmation";
import { PaymentProvider, PaymentRequest } from "@angular-wex/api-providers";
import { Calendar } from "../../../components/calendar/calendar";
import { WexAlertController } from "../../../components/wex-alert-controller/wex-alert-controller";
import { NavBarController } from "../../../providers/nav-bar-controller";
import { Reactive, StateEmitter, EventSource } from "angular-rxjs-extensions";
import { Subject } from "rxjs";
import { ViewDidEnter } from "angular-rxjs-extensions-ionic";

export type AddPaymentNavParams = keyof {
  payment
};

export namespace AddPaymentNavParams {
  export const Payment: AddPaymentNavParams = "payment";
}

//# AddPaymentPage
@Component({
  selector: "page-add-payment",
  templateUrl: "add-payment.html"
})
@Reactive()
export class AddPaymentPage extends SecurePage {

  public readonly DATE_FORMAT: string = "MMMM D";

  @ViewChild("calendar") public calendar: Calendar;

  @Value("PAGES.PAYMENTS.ADD.LABELS") private readonly LABELS: any;

  @ViewDidEnter() viewDidEnter$: Observable<void>;
  @EventSource() onUpdateAmount$: Observable<any>;
  @EventSource() onUpdateBankAccount$: Observable<any>;
  @EventSource() onUpdateDate$: Observable<any>;
  @EventSource() onCancel$: Observable<any>;
  @EventSource() onSchedulePayment$: Observable<any>;

  @StateEmitter() private payment$: Subject<UserPayment>;
  @StateEmitter() private paymentDueDate$: Subject<Date>;
  @StateEmitter() private paymentLabel$: Subject<string>;
  @StateEmitter() private displayAmountWarning$: Subject<boolean>;
  @StateEmitter() private displayDueDateWarning$: Subject<boolean>;
  @StateEmitter() private submitButtonText$: Subject<string>;
  @StateEmitter() private pageTitle$: Subject<string>;
  @StateEmitter() private isLoading$: Subject<boolean>;

  @StateEmitter.Alias("payment$.date")
  private paymentDate$: Observable<Date>;

  @StateEmitter.Alias("payment$.bankAccount")
  public /** @template */ paymentBankAccount$: Observable<BankAccount>;

  @StateEmitter.Alias("paymentService.hasMinimumPaymentDue$")
  private hasMinimumPaymentDue$: Observable<boolean>;

  public minPaymentDate: Date = new Date();
  public maxPaymentDate: Date = moment().add(moment.duration(180, "days")).toDate();

  constructor(
    injector: Injector,
    navParams: NavParams,
    public navCtrl: NavController,
    private viewController: ViewController,
    public paymentService: PaymentService,
    public wexAlertController: WexAlertController,
    private paymentProvider: PaymentProvider,
    public navBarCtrl: NavBarController,
  ) {
    super({ pageName: "Payments.Add", trackView: false }, injector);

    let existingPayment = navParams.get(AddPaymentNavParams.Payment);

    const schedulePayment = (paymentRequest: PaymentRequest, paymentId?: string) => {
      this.isLoading$.next(true);

      let accountId: string = this.session.user.billingCompany.details.accountId;
      let paymentState: Observable<Payment>;

      if (paymentId) {
        paymentState = this.paymentProvider.editPayment(accountId, paymentId, paymentRequest);
      }
      else {
        paymentState = this.paymentProvider.addPayment(accountId, paymentRequest);
      }

      paymentState
        .finally(() => this.isLoading$.next(false))
        .subscribe((payment) => {
          // Update the cache
          //this.sessionCache.update$(Session.Field.Payments);
          this.navCtrl.push(AddPaymentConfirmationPage, { payment })
            .then(() => this.navCtrl.removeView(this.viewController));
          this.trackAnalyticsPageView(paymentId ? "confirmationUpdated" : "confirmationScheduled");
        }, (error) => {
          console.error(error);
          this.wexAlertController.alert(this.CONSTANTS.LABELS.changesFailed);
          return Observable.throw(error);
        });
    };

    this.pageTitle$.next(existingPayment ? this.CONSTANTS.EDIT.title : this.CONSTANTS.CREATE.title);

    this.submitButtonText$.next(existingPayment ? this.CONSTANTS.LABELS.updatePayment : this.CONSTANTS.LABELS.schedulePayment);

    this.createUserPayment$(existingPayment).subscribe(userPayment => this.payment$.next(userPayment));

    this.paymentService.paymentDueDate$.subscribe(paymentDueDate => this.paymentDueDate$.next(moment(paymentDueDate).toDate()));

    Observable.combineLatest(this.payment$, this.paymentService.minimumPaymentDue$).subscribe((args) => {
      let [payment, minimumPaymentDue] = args;

      this.paymentLabel$.next(this.LABELS[payment.amount.type]);
      this.displayAmountWarning$.next(payment.amount.value < minimumPaymentDue);
    });

    Observable.combineLatest(this.paymentDate$, this.paymentDueDate$, this.hasMinimumPaymentDue$).subscribe((args) => {
      let [paymentDate, paymentDueDate, hasMinimumPaymentDue] = args;

      this.displayDueDateWarning$.next(paymentDueDate < paymentDate && hasMinimumPaymentDue);
    });

    this.viewDidEnter$.subscribe(() => this.trackAnalyticsPageView(existingPayment ? "makePaymentEdit" : "makePaymentInitial"));

    this.onUpdateAmount$
      .flatMap(() => Observable.zip(this.paymentService.amountOptions$, this.payment$).take(1))
      .subscribe((args) => {
        let [amountOptions, payment] = args;
        let selectedItem = _.first(_.filter(amountOptions, { type: payment.amount.type }));

        this.navigateToSelectionPage("amount", amountOptions, selectedItem);
      });

    this.onUpdateBankAccount$
      .flatMap(() => Observable.zip(paymentService.bankAccounts$, this.payment$).take(1))
      .subscribe((args) => {
        let [bankAccounts, payment] = args;

        this.navigateToSelectionPage("bankAccount", bankAccounts, payment.bankAccount);
      });

    this.onUpdateDate$.subscribe(() => this.calendar.displayCalendar());

    this.onCancel$.subscribe(data => viewController.dismiss(data));

    this.onSchedulePayment$
      .flatMap(() => this.payment$.asObservable().take(1))
      .subscribe((payment) => schedulePayment({
        amount: payment.amount.value,
        scheduledDate: payment.date.toISOString(),
        bankAccountId: payment.bankAccount.details.id
      }, existingPayment ? existingPayment.id : undefined));
  }

  private navigateToSelectionPage(selectionType: keyof UserPayment, options: PaymentSelectionOption[], selectedItem: PaymentSelectionOption) {
    let onSelection = (selectedItem: PaymentSelectionOption) => this.payment[selectionType] = selectedItem;

    this.navCtrl.push(AddPaymentSelectionPage, { selectionType, options, selectedItem, onSelection });

    const event = selectionType + (this.isEditingPayment ? "Edit" : "Schedule");
    this.trackAnalyticsPageView(event);
  }

  private createUserPayment$(payment: Payment): Observable<UserPayment> {
    if (payment) {
      return this.paymentService.resolvePaymentAmountType$(payment.details.amount)
        .map((paymentAmountType): UserPayment => ({
          amount: {
            type: paymentAmountType,
            value: payment.details.amount
          },
          id: payment.details.id,
          date: moment(payment.details.scheduledDate).toDate(),
          bankAccount: payment.bankAccount
        }));
    }
    else {
      return Observable.zip(this.paymentService.defaultAmount$, this.paymentService.defaultBankAccount$)
        .take(1)
        .map((args: [UserPaymentAmount, BankAccount]) => {
          let [defaultAmount, defaultBankAccount] = args;
          return {
            amount: defaultAmount,
            date: new Date(),
            bankAccount: defaultBankAccount
          };
        });
    }
  }
}
