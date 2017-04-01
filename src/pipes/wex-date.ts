import * as moment from "moment";
import { Injectable, Pipe } from "@angular/core";
import { Value } from "../decorators/value";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "wexDate"
})
@Injectable()
export class WexDate {

  @Value("LOCALE") private static readonly LOCALE: string;
  @Value("DATETIME") private static readonly CONSTANTS: any;

  private datePipe: DatePipe = new DatePipe(WexDate.LOCALE);

  public transform(value: string, ignoreOffset: boolean) {
    if (ignoreOffset) {
      return moment.parseZone(value).format(WexDate.CONSTANTS.DATE_FORMAT);
    }

    return this.datePipe.transform(value, WexDate.CONSTANTS.DATE_FORMAT);
  }
}
