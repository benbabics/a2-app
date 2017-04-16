import * as _ from "lodash";
import { Model } from "./model";
import { ShippingCarrier } from "./shipping-carrier";
import { ShippingMethod } from "./shipping-method";
import { Address } from "./address";
import { CompanyStub } from "./company-stub";

interface CompanyDetails extends CompanyStub.Details {
  defaultCardShippingAddress: Address.Details;
  regularCardShippingMethod: ShippingMethod.Details;
  cardShippingCarrier: ShippingCarrier.Details;
  status: string;
  statusReason: string;
}

export class Company extends Model<CompanyDetails> {

  public get cardShippingCarrier(): ShippingCarrier {
    return new ShippingCarrier(this.details.cardShippingCarrier);
  }

  public get defaultCardShippingAddress(): Address {
    return new Address(this.details.defaultCardShippingAddress);
  }

  public get regularCardShippingMethod(): ShippingMethod {
    return new ShippingMethod(this.details.regularCardShippingMethod);
  }

  public get hasRegularShippingMethod(): boolean {
    return !!_.find(this.details.cardShippingCarrier.shippingMethods, { id: this.details.regularCardShippingMethod.id });
  }
}

export namespace Company {
    export type Details = CompanyDetails;
    export type Field = keyof Details;
}
