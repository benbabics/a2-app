import { Component, Injector } from "@angular/core";
import { NavParams } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { PostedTransaction } from "@angular-wex/models";
import { NameUtils } from "../../../utils/name-utils";

@Component({
  selector:    "page-transaction-details",
  templateUrl: "transaction-details.html"
})
export class TransactionDetailsPage extends DetailsPage {
  public transaction: PostedTransaction;

  constructor(
    injector: Injector,
    public navParams: NavParams
  ) {
    super( "Transactions.Details", injector );
    this.transaction = this.navParams.get("item");
  }

  public get driverFirstName(): string {
    return NameUtils.PrintableName(this.transaction.details.driverFirstName);
  }

  public get driverLastName(): string {
    return NameUtils.PrintableName(this.transaction.details.driverLastName);
  }
}
