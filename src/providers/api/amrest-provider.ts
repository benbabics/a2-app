import { ApiProvider } from "./api-provider";
import { Value } from "../../decorators/value";

export abstract class AmrestProvider extends ApiProvider {

  @Value("APIS.AMREST.BASE_URL") protected BASE_URL: string;
  @Value("APIS.AMREST.ENDPOINTS.ACCOUNTS") protected ACCOUNTS: any;

  protected accountEndpoint(endpoint: string, accountId: string): string {
    return [this.BASE_URL, this.ACCOUNTS.BASE, accountId, endpoint].join("/");
  }
}
