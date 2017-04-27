import { NavBarController } from './../../providers/nav-bar-controller';
import { Component } from "@angular/core";
import { CardsPage } from "../../pages/cards/cards";
import { LandingPage } from "../../pages/landing/landing";
import { PaymentsPage } from "../../pages/payments/payments";
import { Value } from "../../decorators/value";
import { App, Tab } from "ionic-angular";

@Component({
  selector: "wex-nav-bar",
  templateUrl: "wex-nav-bar.html"
})
export class WexNavBar {

  @Value("NAVIGATION") public CONSTANTS: any;

  constructor(private app: App, private navBarController: NavBarController) { }

  public get CardsPage() {
    return CardsPage;
  }

  public get LandingPage() {
    return LandingPage;
  }

  public get PaymentsPage() {
    return PaymentsPage;
  }

  public get paymentsBadgeText(): string {
    return this.navBarController.paymentsBadgeText;
  }

  public resetTab() {
    let activeNav = this.app.getActiveNav();

    // Go back to the root page of the tab's nav stack when switching to tab
    if (activeNav instanceof Tab && activeNav.length() > 1) {
      activeNav.popToRoot();
    }
  }
}
