import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Card } from "@angular-wex/models";
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

export type CardUpdateType = keyof {
  reissue
};

export namespace CardUpdateType {
  export const Reissue: CardUpdateType = "reissue";
}

export interface CardUpdateRequest {
  updateType: CardUpdateType;
  reissueReason?: string;
  shippingMethodId?: string;
}

@Injectable()
export class CardProvider extends AmrestProvider {

  private CARDS: any = this.ACCOUNTS.CARDS;

  constructor(protected http: Http) {
    super(http);
  }

  public search(accountId: string, searchOptions?: CardSearchOptions): Observable<Card[]> {
    return this.http.get(this.accountEndpoint(this.CARDS.BASE, accountId), { search: this.searchParamsFromObject(searchOptions) })
      .map((response: Response): Card[] | ErrorObservable<any> => {
        let json: any = response.json();
        let data: Card.Details[] = json.data;

        if (data) {
          return data.map<Card>((details: Card.Details) => new Card(details));
        }
        else {
          return this.handleRequestError(response);
        }
      })
      .catch(this.handleRequestError);
  }

  public update(accountId: string, cardId: string, updateRequest: CardUpdateRequest): Observable<Card> {
    return this.http.post(this.accountEndpoint(this.CARDS.BASE, accountId, cardId), updateRequest)
      .map((response: Response): Card | ErrorObservable<any> => {
        let data: Card.Details = response.json();

        if (data) {
          return new Card(data);
        }
        else {
          return this.handleRequestError(response);
        }
      })
      .catch(this.handleRequestError);
  }
}
