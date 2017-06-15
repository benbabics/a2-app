import * as _ from "lodash";
import { AppConstants } from "../app/app.constants";

const Constants = AppConstants();

export abstract class Page {

  public readonly CONSTANTS: any;

  constructor(public readonly pageName: string) {
    this.CONSTANTS = _.merge(this.defaultConstants, this.pageConstants);
  }

  private get defaultConstants(): any {
    return {
      BUTTONS: Constants.BUTTONS,
      PLATFORM: Constants.PLATFORM
    };
  }

  private get pageConstants(): any {
    return _.get(Constants, `PAGES.${this.pageName.toUpperCase().replace(/\s/g, "_")}`);
  }

  public resolvePlatformConstant(constant: any): string {
    return _.get(constant, Constants.PLATFORM.CURRENT, null);
  }
}
