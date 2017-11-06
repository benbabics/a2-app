import * as _ from "lodash";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Component } from "@angular/core";
import { CardsPage } from "../../pages/cards/cards";
import { DriversPage } from "../../pages/drivers/drivers";
import { LandingPage } from "../../pages/landing/landing";
import { PaymentsPage } from "../../pages/payments/payments";
import { TransactionsPage } from "../../pages/transactions/transactions";
import { Value } from "../../decorators/value";
import { Tab } from "ionic-angular";
import { WexPlatform } from "../../providers/platform";

@Component({
  selector: "wex-nav-bar",
  templateUrl: "wex-nav-bar.html"
})
export class WexNavBar {

  @Value("NAVIGATION") public CONSTANTS: any;

  constructor(public platform: WexPlatform, protected googleAnalytics: GoogleAnalytics) {}

  public get CardsPage() {
    return CardsPage;
  }

  public get DriversPage() {
    return DriversPage;
  }

  public get LandingPage() {
    return LandingPage;
  }

  public get PaymentsPage() {
    return PaymentsPage;
  }

  public get TransactionsPage() {
    return TransactionsPage;
  }

  public resetTab(tab: Tab) {
    // Go back to the root page of the tab's nav stack when switching to tab
    if (tab.length() > 1) {
      tab.popToRoot();
    }

    this.trackEvent(tab.tabTitle);
  }

  private trackEvent(eventName: string) {
    const eventInfo = _.get<any[]>(this.CONSTANTS, `ANALYTICS.EVENTS.${eventName}`);
    if (eventInfo) {
      this.googleAnalytics.trackEvent.apply(this.googleAnalytics, eventInfo);
    }
  }
}
