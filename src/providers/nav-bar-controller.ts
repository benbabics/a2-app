import { App, Tabs, NavOptions, Tab } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class NavBarController {

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
    return this.app.getRootNav().getActiveChildNav() as Tabs;
  }

  public getTab(page: Function): Tab {
    let tabIndex = this.pages.indexOf(page.name);

    if (tabIndex === -1) {
      let error = `Failed to transition to page ${page.name} (not found)`;
      console.error(error);
      return null;
    }

    return this.ionTabs.getByIndex(tabIndex);
  }

  public select(page: Function, options?: NavOptions) {
    let tabIndex = this.pages.indexOf(page.name);

    if (tabIndex === -1) {
      console.error(`Failed to transition to page ${page.name} (not found)`);
      return;
    }

    this.ionTabs.select(tabIndex, options);
    return Promise.resolve();
  }
}
