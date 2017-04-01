import { Http, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";

export abstract class ApiProvider {

  constructor(protected http: Http) {}

  public static searchParamsFromObject(object: any): URLSearchParams {
    let params = new URLSearchParams();

    for (let key in object) {
      let value = object[key];
      if (value) {
        params.set(key, value);
      }
    }
    return params;
  }
}
