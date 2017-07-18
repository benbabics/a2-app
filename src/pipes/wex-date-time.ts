import * as moment from "moment";
import { Injectable, Pipe } from "@angular/core";
import { Value } from "../decorators/value";

@Pipe({
  name: "wexDateTime"
})
@Injectable()
export class WexDateTime {

  @Value("LOCALE") private static readonly LOCALE: string;
  @Value("DATETIME") private static readonly CONSTANTS: any;

  public transform(value: string) {

    if (!value) {
      return "Unknown";
    }

    return moment(value).format(WexDateTime.CONSTANTS.DATE_TIME_FORMAT);
  }
}
