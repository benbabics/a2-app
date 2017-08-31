import { Injectable, Pipe } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { Value } from "../decorators/value";

@Pipe({
  name: "wexCurrency"
})
@Injectable()
export class WexCurrency {

  @Value("LOCALE") private static readonly LOCALE: string;
  @Value("CURRENCY") private static readonly CONSTANTS: any;

  private currencyPipe: CurrencyPipe = new CurrencyPipe(WexCurrency.LOCALE);

  public transform(value, hideDecimal?: boolean) {
    return this.currencyPipe.transform(value, WexCurrency.CONSTANTS.FORMAT, true, hideDecimal ? "1.0-0" : undefined);
  }
}
