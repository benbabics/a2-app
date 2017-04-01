import * as _ from "lodash";
import { ApiProvider } from "./api-provider";
import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../../decorators/value";
import { UserCredentials } from "../../models/user-credentials";
import "rxjs/add/operator/map";

@Injectable()
export class AuthProvider extends ApiProvider {
  @Value("AUTH") private AUTH: any;
  @Value("APIS.KEYMASTER.BASE_URL") private BASE_URL: string;
  @Value("APIS.KEYMASTER.ENDPOINTS.TOKEN") private TOKEN: string;

  constructor(protected http: Http) {
    super(http);
  }

  public refresh(): Observable<string> {
    return Observable.throw(`TODO`);
  }

  public requestToken(userCredentials: UserCredentials): Observable<string> {
    // Base64 encode the client credentials
    let encodedCredentials: string = btoa(`${this.AUTH.client_id}:${this.AUTH.client_secret}`);
    let data: string = this.encodeRequestParams({
      grant_type: this.AUTH.grant_type,
      scope: this.AUTH.scope,
      username: userCredentials.username,
      password: userCredentials.password
    });

    return this.http.post([this.BASE_URL, this.TOKEN].join("/"), data, {
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${encodedCredentials}`
      })
    })
    .map((response: Response): string => response.json().access_token)
    .catch((error: Response | any) => {
      return Observable.throw(error);
    });
  }

  private encodeRequestParams(data: any): string {
    let pairs: Array<string> = [];

    _.forEach(data, (value: any, key: string) => pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value)));
    return pairs.join("&").replace(/%20/g, "+");
  }

}
