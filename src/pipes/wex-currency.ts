import { Injectable, Pipe, Inject } from "@angular/core";
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

  public transform(value, superDecimal?: boolean) {
    return this.currencyPipe.transform(value, WexCurrency.CONSTANTS.FORMAT, true);
  }
}
