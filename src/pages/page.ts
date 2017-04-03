import * as _ from "lodash";
import { Constants } from "../app/app.constants";

export abstract class Page {

  public readonly CONSTANTS: any;

  constructor(public readonly pageName: string) {
    this.CONSTANTS = _.get(Constants, `PAGES.${pageName.toUpperCase()}`);
  }
}
