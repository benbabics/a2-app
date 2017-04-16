import { WexCurrency } from "../pipes/wex-currency";
import * as _ from "lodash";
import { Model } from "./model";

interface ShippingMethodDetails {
  id: string;
  name: string;
  cost: string;
  poBoxAllowed: boolean;
  default: boolean;
}

export class ShippingMethod extends Model<ShippingMethodDetails> {

  private static readonly currencyPipe: WexCurrency = new WexCurrency();

  public getDisplayName(showCost?: boolean): string {
    let displayName = this.details.name;
    showCost = _.isUndefined(showCost) ? true : showCost;

    if (showCost) {
      displayName += ` ${ShippingMethod.currencyPipe.transform(this.details.cost)}`;
    }

    return displayName;
  }
}

export namespace ShippingMethod {
    export type Details = ShippingMethodDetails;
    export type Field = keyof Details;
}
