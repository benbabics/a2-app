import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Driver, DriverStatus } from "../../models";

export interface DriverSearchOptions {
  promptId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: DriverStatus;
  departmentId: string;
  pageSize: number;
  pageNumber: number;
}

@Injectable()
export class DriverProvider extends AmrestProvider {

  private DRIVERS: any = this.ACCOUNTS.DRIVERS;

  constructor(protected http: Http) {
    super(http);
  }

  public search(accountId: string, searchOptions?: Partial<DriverSearchOptions>): Observable<Driver[]> {
    return this.http.get(this.accountEndpoint(this.DRIVERS.BASE, accountId), { search: this.searchParamsFromObject(searchOptions) })
      .map((response: Response): Driver[] | ErrorObservable<any> => {
        let json: any = response.json();
        let data: Driver.Details[] = json.data;

        if (data) {
          return data.map<Driver>((details: Driver.Details) => new Driver(details));
        }
        else {
          return this.handleRequestError(response);
        }
      })
      .catch(this.handleRequestError);
  }
}
