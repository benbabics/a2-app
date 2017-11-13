import * as moment from "moment";
import { Component, Injector, ViewChild } from "@angular/core";
import {
  NavParams,
  NavController,
  ViewController,
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { SecurePage } from "../../secure-page";
import { BankAccount, Payment, Company } from "@angular-wex/models";
import { PaymentService, PaymentSelectionOption } from "./../../../providers/payment-service";
import { AddPaymentSelectionPage } from "./add-payment-selection";
import { UserPayment, UserPaymentAmount, Session } from "../../../models";
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
  public readonly minPaymentDate: Date = new Date();
  public readonly maxPaymentDate: Date = moment().add(moment.duration(180, "days")).toDate();

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
    super({ pageName: "Payments.Add", trackView: false }, injector, [
      Session.Field.BankAccounts,
      Session.Field.InvoiceSummary
    ]);

    let existingPayment: Payment = navParams.get(AddPaymentNavParams.Payment);

    this.pageTitle$
      .next(existingPayment ? this.CONSTANTS.EDIT.title : this.CONSTANTS.CREATE.title);

    this.submitButtonText$
      .next(existingPayment ? this.CONSTANTS.LABELS.updatePayment : this.CONSTANTS.LABELS.schedulePayment);

    this.createUserPayment$(existingPayment)
      .subscribe(userPayment => this.payment$.next(userPayment));

    this.paymentService.paymentDueDate$
      .subscribe(paymentDueDate => this.paymentDueDate$.next(moment(paymentDueDate).toDate()));

    Observable.combineLatest(this.payment$, paymentService.minimumPaymentDue$).subscribe((args) => {
      let [payment, minimumPaymentDue] = args;

      this.paymentLabel$.next(this.LABELS[payment.amount.type]);
      this.displayAmountWarning$.next(payment.amount.value < minimumPaymentDue);
    });

    Observable.combineLatest(this.paymentDate$, this.paymentDueDate$, this.hasMinimumPaymentDue$).subscribe((args) => {
      let [paymentDate, paymentDueDate, hasMinimumPaymentDue] = args;

      this.displayDueDateWarning$.next(paymentDueDate < paymentDate && hasMinimumPaymentDue);
    });

    this.viewDidEnter$
      .subscribe(() => this.trackAnalyticsPageView(existingPayment ? "makePaymentEdit" : "makePaymentInitial"));

    this.onUpdateAmount$
      .flatMap(() => Observable.combineLatest(paymentService.amountOptions$, this.payment$).take(1))
      .subscribe((args) => {
        let [amountOptions, payment] = args;

        this.navigateToSelectionPage(amountOptions, payment.amount);
        this.trackAnalyticsPageView(`amount${existingPayment ? "Edit" : "Schedule"}`);
      });

    this.onUpdateBankAccount$
      .flatMap(() => Observable.combineLatest(paymentService.bankAccounts$, this.payment$).take(1))
      .subscribe((args) => {
        let [bankAccounts, payment] = args;

        this.navigateToSelectionPage(bankAccounts, payment.bankAccount);
        this.trackAnalyticsPageView(`bankAccount${existingPayment ? "Edit" : "Schedule"}`);
      });

    this.onUpdateDate$
      .subscribe(() => this.calendar.displayCalendar());

    this.onCancel$
      .subscribe(data => viewController.dismiss(data));

    this.onSchedulePayment$
      .flatMap(() => Observable.combineLatest(
        this.payment$,
        this.sessionCache.getField$<Company>(Session.Field.BillingCompany)
      ).take(1))
      .subscribe((args) => {
        let [payment, billingCompany] = args;

        this.schedulePayment(billingCompany.details.accountId, {
          amount: payment.amount.value,
          scheduledDate: payment.date.toISOString(),
          bankAccountId: payment.bankAccount.details.id
        }, existingPayment ? existingPayment.details.id : undefined);
      });
  }

  private navigateToSelectionPage<T extends PaymentSelectionOption>(items: T[], selectedItem: T) {
    let userPayment$ = this.payment$;

    this.navCtrl.push(AddPaymentSelectionPage, { items, selectedItem, userPayment$ });
  }

  private schedulePayment(accountId: string, paymentRequest: PaymentRequest, paymentId?: string) {
    this.isLoading$.next(true);

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
        this.navCtrl.push(AddPaymentConfirmationPage, { payment })
          .then(() => this.navCtrl.removeView(this.viewController));

        this.trackAnalyticsPageView(paymentId ? "confirmationUpdated" : "confirmationScheduled");
      }, (error) => {
        console.error(error);
        this.wexAlertController.alert(this.CONSTANTS.LABELS.changesFailed);
      });
  }

  private createUserPayment$(existingPayment?: Payment): Observable<UserPayment> {
    if (existingPayment) {
      return this.paymentService.resolvePaymentAmountType$(existingPayment.details.amount)
        .map((paymentAmountType): UserPayment => ({
          amount: {
            type: paymentAmountType,
            value: existingPayment.details.amount
          },
          id: existingPayment.details.id,
          date: moment(existingPayment.details.scheduledDate).toDate(),
          bankAccount: existingPayment.bankAccount
        }));
    }
    else {
      return Observable.combineLatest(this.paymentService.defaultAmount$, this.paymentService.defaultBankAccount$)
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
