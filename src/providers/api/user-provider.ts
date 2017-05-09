import { AmrestProvider } from "./amrest-provider";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../../decorators/value";
import { User } from "@angular-wex/models";
import "rxjs/add/operator/map";

@Injectable()
export class UserProvider extends AmrestProvider {

  @Value("APIS.AMREST.ENDPOINTS.USER.CURRENT") private CURRENT: string;

  constructor(protected http: Http) {
    super(http);
  }

  public current(): Observable<User> {
    return this.http.get([this.BASE_URL, this.CURRENT].join("/"))
      .map((response: Response): User => new User(response.json()))
      .catch(this.handleRequestError);
  }
}
