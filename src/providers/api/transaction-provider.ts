import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Transaction, ListResponse } from "../../models";

export interface PostedTransactionSearchOptions {
  fromDate: Date;
  toDate: Date;
  pageSize: number;
  pageNumber: number;
  filterBy?: string;
  filterValue?: string;
  cardId?: string;
}

@Injectable()
export class TransactionProvider extends AmrestProvider {

  private TRANSACTIONS: any = this.ACCOUNTS.TRANSACTIONS;

  constructor(protected http: Http) {
    super(http);
  }

  public searchPosted(accountId: string, searchOptions: PostedTransactionSearchOptions): Observable<ListResponse<Transaction>> {
    return this.http.get(this.accountEndpoint(this.TRANSACTIONS.POSTED.BASE, accountId), { search: this.searchParamsFromObject(searchOptions) })
      .map((response: Response): ListResponse<Transaction> | ErrorObservable<any> => {
        let json: any = response.json();
        let data: Transaction.Details[] = json.data;

        if (data) {
          let values: Transaction[] = data.map<Transaction>((details: Transaction.Details) => new Transaction(details));
          return {
            values: values,
            totalResultCount: json.totalResults
          };
        }
        else {
          return this.handleRequestError(response);
        }
      })
      .catch(this.handleRequestError);
  }
}
