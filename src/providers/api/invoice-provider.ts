import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { InvoiceSummary } from "../../models";
import { AmrestProvider } from "./amrest-provider";
import "rxjs/add/operator/map";

@Injectable()
export class InvoiceProvider extends AmrestProvider {

  constructor(protected http: Http) {
    super(http);
  }

  public current(accountId: string): Observable<InvoiceSummary> {
    return this.http.get(this.accountEndpoint(this.INVOICES.CURRENT, accountId))
      .map((response: Response): InvoiceSummary => new InvoiceSummary(response.json()))
      .catch((error: Response | any) => {
        console.log(error);
        return Observable.throw(error);
      });
  }
}
