import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Card } from "../../models";
import "rxjs/add/operator/map";

export interface CardSearchOptions {
    embossedCardNumberFilter?: string;
    embossingValue1Filter?: string;
    embossingValue2Filter?: string;
    embossingValue3Filter?: string;
    statuses?: string[];
    orderBy?: string;
    pageSize?: number;
    pageNumber?: number;
}

@Injectable()
export class CardProvider extends AmrestProvider {

  private CARDS: any = this.ACCOUNTS.CARDS;

  constructor(protected http: Http) {
    super(http);
  }

  public search(accountId: string, searchOptions?: CardSearchOptions): Observable<Card[]> {
    return this.http.get(this.accountEndpoint(this.CARDS.SEARCH, accountId), { search: this.searchParamsFromObject(searchOptions) })
      .map((response: Response): Card[] | ErrorObservable<any> => {
        let json: any = response.json();
        let data: Card.Details[] = json.data;

        if (data) {
          return data.map<Card>((details: Card.Details) => new Card(details));
        }
        else {
          return this.handleRequestError(json);
        }
      })
      .catch(this.handleRequestError);
  }
}
