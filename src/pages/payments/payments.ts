import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController, PaymentProvider } from "../../providers";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Payment, PaymentStatus } from "../../models";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = PaymentStatus.values();

  public readonly dividerLabels: string[] = PaymentsPage.PAYMENT_STATUSES.map(PaymentStatus.displayName);

  constructor(public navCtrl: WexNavController, public navParams: NavParams, private paymentProvider: PaymentProvider) {
    super("Payments");
  }

  public get scheduledPayments(): Payment[] {
    return this.sortedItemGroups[PaymentStatus.SCHEDULED];
  }

  public get completedPayments(): Payment[] {
    return this.sortedItemGroups[PaymentStatus.COMPLETE];
  }

  public get sortedItemLists(): Payment[][] {
    return [this.scheduledPayments, this.completedPayments];
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
