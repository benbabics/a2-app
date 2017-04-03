import { App, Tabs, NavOptions } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class WexNavController {

  // Note: This must be defined in the same order as the navbar tab layout (see wex-nav-bar.html)
  public readonly pages: Object[] = [
    "LoginPage",
    "LandingPage",
    "PaymentsPage",
    "TransactionsPage",
    "CardsPage",
    "DriversPage"
  ];

  constructor(private app: App) { }

  public get ionTabs(): Tabs {
    return this.app.getRootNav() as any as Tabs;
  }

  public push(page: Function, params?: NavOptions) {
    let tabIndex = this.pages.indexOf(page.name);

    if (tabIndex === -1) {
      console.error(`Failed to transition to page ${page.name} (not found)`);
      return;
    }

    this.ionTabs.select(tabIndex, params);
  }
}
