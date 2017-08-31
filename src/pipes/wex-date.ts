import * as moment from "moment";
import { Injectable, Pipe } from "@angular/core";
import { Value } from "../decorators/value";

@Pipe({
  name: "wexDate"
})
@Injectable()
export class WexDate {

  @Value("DATETIME") private static readonly CONSTANTS: any;

  public transform(value: string, ignoreOffset: boolean, format?: string) {

    if (!value) {
      return "Unknown";
    }

    format = format ? format : WexDate.CONSTANTS.DATE_FORMAT;

    if (ignoreOffset) {
      return moment.parseZone(value).format(format);
    }

    return moment(value).format(format);
  }
}
