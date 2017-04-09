import { Observable } from "rxjs";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { Http, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";

export abstract class ApiProvider {

  constructor(protected http: Http) {}

  protected handleRequestError(error: any): ErrorObservable<any> {
    console.log(error);
    return Observable.throw(error);
  }

  public searchParamsFromObject(object: any): URLSearchParams {
    let params = new URLSearchParams();

    for (let key in object) {
      params.set(key, object[key]);
    }
    return params;
  }
}
