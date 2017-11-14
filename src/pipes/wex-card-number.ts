import { Injectable, Pipe } from "@angular/core";

@Pipe({
  name: "wexCardNumber"
})
@Injectable()
export class WexCardNumberPipe {

  private static readonly CARD_MASK = "••••";
  private static readonly NUM_DIGITS = 5;

  public transform(value: any) {
    return `${WexCardNumberPipe.CARD_MASK}${String(value).slice(-WexCardNumberPipe.NUM_DIGITS)}`;
  }
}
