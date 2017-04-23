import { ApiProvider } from "./api-provider";
import { Value } from "../../decorators/value";

export abstract class AmrestProvider extends ApiProvider {

  @Value("APIS.AMREST.BASE_URL") protected BASE_URL: string;
  @Value("APIS.AMREST.ENDPOINTS.ACCOUNTS") protected ACCOUNTS: any;

  protected accountEndpoint(endpoint: string, accountId: string, pathParam?: string): string {
    let uri = [this.BASE_URL, this.ACCOUNTS.BASE, accountId, endpoint].join("/");

    if (pathParam) {
      uri = [uri, pathParam].join("/");
    }

    return uri;
  }
}
