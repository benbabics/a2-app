import { ApiProvider } from "./api-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../../decorators/value";
import { User } from "../../models";
import "rxjs/add/operator/map";

@Injectable()
export class UserProvider extends ApiProvider {
  @Value("APIS.AMREST.BASE_URL") private BASE_URL: string;
  @Value("APIS.AMREST.ENDPOINTS.USER.CURRENT") private CURRENT: string;

  constructor(protected http: Http) {
    super(http);
  }

  public current(): Observable<User> {
    return this.http.get([this.BASE_URL, this.CURRENT].join("/"))
      .map((response: Response): User => response.json())
      .catch((error: Response | any) => {
        console.log(error);
        return Observable.throw(error);
      });
  }
}
