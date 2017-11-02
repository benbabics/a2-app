import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { OnInit, Injector } from "@angular/core";
import * as _ from "lodash";
import { AppConstants } from "../app/app.constants";

const Constants = AppConstants();

export interface PageParams {
  trackView?: boolean;
  trackingName?: string;
}

export abstract class Page implements OnInit {

  public readonly CONSTANTS: any;
  public googleAnalytics: GoogleAnalytics;

  constructor(public readonly pageName: string, public injector: Injector, protected params?: PageParams) {
    this.CONSTANTS = _.merge(this.defaultConstants, this.pageConstants);
    this.googleAnalytics = injector.get(GoogleAnalytics);
  }

  ngOnInit() {
    let params = this.params || {};
    if (!this.params || params.trackView !== false) {
      this.trackAnalyticsPageView(params.trackingName || this.pageName);
    }
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

  protected trackAnalyticsPageView(pageName: string) {
    let trackingName = _.get<string>(this.CONSTANTS, `ANALYTICS.PAGE`)
                    || _.get<string>(this.CONSTANTS, `ANALYTICS.PAGES.${pageName}`, pageName);
    this.googleAnalytics.trackView(trackingName);
  }

  protected trackAnalyticsEvent(eventName: string, ...additionalParams: any[]): Promise<any> {
    let eventInfo = _.get<any[]>(this.CONSTANTS, `ANALYTICS.EVENTS.${eventName}`);

    if (!eventInfo) {
      return Promise.reject(`Analytics event ${eventName} not found for page ${this.pageName}.`);
    }

    if (additionalParams) {
      eventInfo = eventInfo.concat(additionalParams);
    }

    return this.googleAnalytics.trackEvent.apply(this.googleAnalytics, eventInfo);
  }

  public resolvePlatformConstant(constant: any): string {
    return _.get(constant, Constants.PLATFORM.CURRENT, null);
  }
}
