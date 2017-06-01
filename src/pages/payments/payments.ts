import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SessionManager } from "../../providers";
import { StaticListPage, GroupedList, FetchOptions } from "../static-list-page";
import { Payment, PaymentStatus } from "@angular-wex/models";
import { Session } from "../../models";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  protected readonly listGroupDisplayOrder: string[] = PaymentsPage.PAYMENT_STATUSES;
  public readonly dividerLabels: string[] = PaymentsPage.PAYMENT_STATUSES.map(PaymentStatus.displayName);

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Payments", sessionManager);
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
}
