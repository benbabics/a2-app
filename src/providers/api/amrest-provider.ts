import { ApiProvider } from "./api-provider";
import { Value } from "../../decorators/value";

export abstract class AmrestProvider extends ApiProvider {

  @Value("APIS.AMREST.BASE_URL") protected BASE_URL: string;
  @Value("APIS.AMREST.ENDPOINTS.ACCOUNTS") protected ACCOUNT: any;
  @Value("APIS.AMREST.ENDPOINTS.ACCOUNTS.INVOICES") protected INVOICES: any;

  protected accountEndpoint(endpoint: string, accountId: string): string {
    return [this.BASE_URL, this.ACCOUNT.BASE, accountId, endpoint].join("/");
  }
}
