import * as _ from "lodash";
import { AppConstants } from "../app/app.constants";

const Constants = AppConstants();

export abstract class Page {

  public readonly CONSTANTS: any;

  constructor(public readonly pageName: string) {
    this.CONSTANTS = _.get(Constants, `PAGES.${pageName.toUpperCase().replace(/\s/g, "_")}`);
  }

  public resolvePlatformConstant(constant: any): string {
    return _.get(constant, Constants.PLATFORM, null);
  }
}
