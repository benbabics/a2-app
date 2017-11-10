import { Injectable, Pipe } from "@angular/core";
import { PostedTransaction, PendingTransaction } from "@angular-wex/models";
import { BaseTransactionT } from "./../pages/transactions/transactions";

@Pipe({
  name: "transactionAmount"
})
@Injectable()
export class TransactionAmountPipe {

  public transform(transaction: BaseTransactionT): number {
    if (transaction instanceof PendingTransaction) {
      return transaction.details.authorizationAmount;
    }
    else if (transaction instanceof PostedTransaction) {
      return transaction.details.netCost;
    }

    return 0;
  }
}
