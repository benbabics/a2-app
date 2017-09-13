import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { OnInit, Injector } from "@angular/core";
import * as _ from "lodash";
import { AppConstants } from "../app/app.constants";

const Constants = AppConstants();

export abstract class Page implements OnInit {

  public readonly CONSTANTS: any;
  public googleAnalytics: GoogleAnalytics;

  constructor(public readonly pageName: string, public injector: Injector) {
    this.CONSTANTS = _.merge(this.defaultConstants, this.pageConstants);
    this.googleAnalytics = injector.get(GoogleAnalytics);
  }

  ngOnInit() {
    this.googleAnalytics.trackView(this.pageName);
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
}
