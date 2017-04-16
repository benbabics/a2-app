import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Company } from "../../models";

@Injectable()
export class AccountProvider extends AmrestProvider {

  constructor(protected http: Http) {
    super(http);
  }

  public get(accountId: string): Observable<Company> {
    return this.http.get(this.accountEndpoint("", accountId))
      .map((response: Response): Company => new Company(response.json()))
      .catch(this.handleRequestError);
  }
}
