import { Injectable } from "@angular/core";
import { Headers, Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../decorators/value";
import { SessionCache } from "./session-cache";
import { NetworkStatus } from "./network-status";

@Injectable()
export class SecureHttp extends Http {

  @Value("APIS.KEYMASTER.BASE_URL") private BASE_URL: string;
  @Value("APIS.KEYMASTER.ENDPOINTS.TOKEN") private TOKEN: string;
  private TOKEN_URL: string = [this.BASE_URL, this.TOKEN].join("/");

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private networkStatus: NetworkStatus) {
    super(backend, defaultOptions);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.delete(url, options), url, options);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.get(url, options), url, options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.post(url, body, options), url, options);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.put(url, body, options), url, options);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept((options: RequestOptionsArgs) => super.options(url, options), url, options);
  }

  private addBearerHeader(options: RequestOptionsArgs): Observable<RequestOptionsArgs> {
    return SessionCache.sessionState$
      .take(1)
      .filter(Boolean)
      .map(session => {
        if (!options.headers) {
          options.headers = new Headers();
        }

        options.headers.append("Authorization", `Bearer ${session.token}`);

        return options;
      });
  }

  private intercept(fn: (options?: RequestOptionsArgs) => Observable<Response>, url: string, options?: RequestOptionsArgs) {
    options = options || {};

    if (url === this.TOKEN_URL) {
      return fn(options);
    }
    else {
      return this.addBearerHeader(options)
        .flatMap(options => fn(options))
        .catch((error: Response | any) => {
          console.log(error);
          this.networkStatus.displayError(error);

          return Observable.throw(error);
        });
    }
  }

}
