import * as _ from "lodash";
import { Component, Injector } from '@angular/core';
import { NavParams, App } from 'ionic-angular';
import { DetailsPage } from "../../details-page";
import { SessionManager } from './../../../providers/session-manager';
import { Transaction } from "@angular-wex/models";

@Component({
  selector:    "page-transaction-details",
  templateUrl: "transaction-details.html"
})
export class TransactionDetailsPage extends DetailsPage {
  public transaction: Transaction;

  constructor(
    injector: Injector,
    private app: App,
    public navParams: NavParams
  ) {
    super( "Transactions.Details", injector );
    this.transaction = this.navParams.get( "item" );
  }
}
