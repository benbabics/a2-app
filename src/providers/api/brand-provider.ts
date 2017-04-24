import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Value } from "../../decorators/value";
import { ApiProvider } from "./api-provider";
import { LocalStorageService } from "angular-2-local-storage/dist";

@Injectable()
export class BrandProvider extends ApiProvider {

  @Value("APIS.GATEKEEPER.BASE_URL") protected BASE_URL: string;
  @Value("APIS.GATEKEEPER.ENDPOINTS.BRAND_LOGO") private BRAND_LOGO: string;

  private static readonly LOGO_DATA_FORMAT: string = "svg";

  constructor(protected http: Http, private localStorage: LocalStorageService) {
    super(http);
  }

  private getBrandCacheKey(brandName: string) {
    return `BrandProvider.logo${brandName.toLowerCase()}`;
  }

  public logo(brandName: string): Observable<string> {
    let cacheKey = this.getBrandCacheKey(brandName);
    let cachedData = this.localStorage.get(cacheKey);

    if (cachedData) {
      return Observable.of(cachedData);
    }

    return this.http.get([this.BASE_URL, this.BRAND_LOGO, [cacheKey, BrandProvider.LOGO_DATA_FORMAT].join(".")].join("/"))
      .map((response: Response) => {
        let data = response.text();
        this.localStorage.set(cacheKey, data);

        return data;
      })
      .catch(this.handleRequestError);
  }
}
