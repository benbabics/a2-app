import * as _ from "lodash";
import { Component } from '@angular/core';
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
    sessionManager: SessionManager,
    private app: App,
    public navParams: NavParams
  ) {
    super( "Transactions.Details", sessionManager );
    this.transaction = this.navParams.get( "item" );
  }
}
