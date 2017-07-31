import { Injectable, Pipe } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "capitalize"
})
@Injectable()
export class Capitalize {
  public transform(value: string) {
    return _.capitalize(value);
  }
}
