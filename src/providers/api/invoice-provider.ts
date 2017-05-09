import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { InvoiceSummary } from "@angular-wex/models";
import { AmrestProvider } from "./amrest-provider";
import "rxjs/add/operator/map";

@Injectable()
export class InvoiceProvider extends AmrestProvider {

  private INVOICES: any = this.ACCOUNTS.INVOICES;

  constructor(protected http: Http) {
    super(http);
  }

  public current(accountId: string): Observable<InvoiceSummary> {
    return this.http.get(this.accountEndpoint(this.INVOICES.CURRENT, accountId))
      .map((response: Response): InvoiceSummary => new InvoiceSummary(response.json()))
      .catch(this.handleRequestError);
  }
}
