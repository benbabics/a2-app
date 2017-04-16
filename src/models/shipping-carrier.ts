import * as _ from "lodash";
import { Model } from "./model";
import { ShippingMethod } from "./shipping-method";

interface ShippingCarrierDetails {
  id: string;
  name: string;
  accountDefault: boolean;
  shippingMethods: ShippingMethod.Details[];
}

export class ShippingCarrier extends Model<ShippingCarrierDetails> {

  public get shippingMethods(): ShippingMethod[] {
    if (!this.details.shippingMethods) {
      return null;
    }

    return this.details.shippingMethods.map((shippingMethod) => new ShippingMethod(shippingMethod));
  }

  public get defaultShippingMethod(): ShippingMethod {
    let shippingMethodDetails = _.find(this.details.shippingMethods, { default: true });

    if (!shippingMethodDetails) {
      return null;
    }

    return new ShippingMethod(shippingMethodDetails);
  }

  public get displayName(): string {
    return this.details.name;
  }
}

export namespace ShippingCarrier {
    export type Details = ShippingCarrierDetails;
    export type Field = keyof Details;
}
