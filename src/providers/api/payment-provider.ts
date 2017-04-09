import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Payment } from "../../models";
import { Observable } from "rxjs/Observable";

export interface PaymentSearchOptions {
    pageSize?: number;
    pageNumber?: number;
}

@Injectable()
export class PaymentProvider extends AmrestProvider {

  private PAYMENTS: any = this.ACCOUNTS.PAYMENTS;

  constructor(protected http: Http) {
    super(http);
  }

  public search(accountId: string, searchOptions?: PaymentSearchOptions): Observable<Payment[]> {
  return this.http.get(this.accountEndpoint(this.PAYMENTS.SEARCH, accountId), { search: this.searchParamsFromObject(searchOptions) })
      .map((response: Response): Payment[] | ErrorObservable<any> => {
        let json: any = response.json();
        let data: Payment.Details[] = json.data;

        if (data) {
          return data.map((details) => new Payment(details));
        }
        else {
          return this.handleRequestError(json);
        }
      })
      .catch(this.handleRequestError);
  }
}
