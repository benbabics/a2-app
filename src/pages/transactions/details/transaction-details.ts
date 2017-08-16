import { Component, Injector } from "@angular/core";
import { NavParams } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Transaction } from "@angular-wex/models";

@Component({
  selector:    "page-transaction-details",
  templateUrl: "transaction-details.html"
})
export class TransactionDetailsPage extends DetailsPage {
  public transaction: Transaction;

  constructor(
    injector: Injector,
    public navParams: NavParams
  ) {
    super( "Transactions.Details", injector );
    this.transaction = this.navParams.get( "item" );
  }
}
