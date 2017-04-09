import * as moment from "moment";
import { Injectable, Pipe } from "@angular/core";
import { Value } from "../decorators/value";

@Pipe({
  name: "wexDate"
})
@Injectable()
export class WexDate {

  @Value("LOCALE") private static readonly LOCALE: string;
  @Value("DATETIME") private static readonly CONSTANTS: any;

  public transform(value: string, ignoreOffset: boolean) {

    if (!value) {
      return "Unknown";
    }

    if (ignoreOffset) {
      return moment.parseZone(value).format(WexDate.CONSTANTS.DATE_FORMAT);
    }

    return moment(value).format(WexDate.CONSTANTS.DATE_FORMAT);
  }
}
