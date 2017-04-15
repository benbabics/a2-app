import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { PaymentProvider } from "../../providers";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Payment, PaymentStatus } from "../../models";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  protected readonly listGroupDisplayOrder: string[] = PaymentsPage.PAYMENT_STATUSES;
  public readonly dividerLabels: string[] = PaymentsPage.PAYMENT_STATUSES.map(PaymentStatus.displayName);

  constructor(public navCtrl: NavController, public navParams: NavParams, private paymentProvider: PaymentProvider) {
    super("Payments");
  }

  protected groupItems(payments: Payment[]): GroupedList<Payment> {
    return this.defaultItemGroup(payments, "status", PaymentsPage.PAYMENT_STATUSES);
  }

  protected sortItems(payments: Payment[]): Payment[] {
    return this.defaultItemSort(payments, "id", "asc");
  }

  protected search(): Observable<Payment[]> {
    return this.paymentProvider.search(this.session.details.user.company.details.accountId, {pageSize: 999, pageNumber: 0});
  }
}
