import { SessionManager } from "./session-manager";
import { Injectable } from "@angular/core";
import { Headers, Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../decorators/value";

@Injectable()
export class SecureHttp extends Http {

  @Value("APIS.KEYMASTER.BASE_URL") private BASE_URL: string;
  @Value("APIS.KEYMASTER.ENDPOINTS.TOKEN") private TOKEN: string;
  private TOKEN_URL: string = [this.BASE_URL, this.TOKEN].join("/");

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.get(url, options), url, options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.post(url, body, options), url, options);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.options(url, options), url, options);
  }

  private addBearerHeader(options: RequestOptionsArgs): RequestOptionsArgs {
    if (SessionManager.hasSession) {
      if (!options.headers) {
        options.headers = new Headers();
      }

      //options.withCredentials = true;
      options.headers.append("Authorization", `Bearer ${SessionManager.currentSession.token}`);
    }
    return options;
  }

  private intercept(fn: Function, url: string, options?: RequestOptionsArgs) {
    options = options || {};

    if (url === this.TOKEN_URL) {
      return fn(options);
    }
    else {
      return fn(this.addBearerHeader(options))
        .catch((error: Response | any) => {
          console.log(error);
          return Observable.throw(error);
        });
    }
  }

}
