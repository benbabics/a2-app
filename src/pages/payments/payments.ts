import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { SessionManager } from "../../providers";
import { StaticListPage, GroupedList } from "../static-list-page";
import { Payment, PaymentStatus, Session } from "../../models";

@Component({
  selector: "page-payments",
  templateUrl: "payments.html"
})
export class PaymentsPage extends StaticListPage<Payment, Payment.Details> {

  private static readonly PAYMENT_STATUSES: PaymentStatus[] = [PaymentStatus.SCHEDULED, PaymentStatus.COMPLETE];

  protected readonly listData: Session.Field = Session.Field.Payments;
  protected readonly listGroupDisplayOrder: string[] = PaymentsPage.PAYMENT_STATUSES;
  public readonly dividerLabels: string[] = PaymentsPage.PAYMENT_STATUSES.map(PaymentStatus.displayName);

  constructor(
    sessionManager: SessionManager,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super("Payments", sessionManager);
  }

  protected groupItems(payments: Payment[]): GroupedList<Payment> {
    return this.defaultItemGroup(payments, "status", PaymentsPage.PAYMENT_STATUSES);
  }

  protected sortItems(payments: Payment[]): Payment[] {
    return this.defaultItemSort(payments, "id", "asc");
  }
}
