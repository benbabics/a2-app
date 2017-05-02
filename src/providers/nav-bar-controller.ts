import { App, Tabs, NavOptions, Tab } from "ionic-angular";
import { Injectable } from "@angular/core";
import { SessionManager } from "./session-manager";
import { Session } from "../models/session";

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

  public paymentsBadgeText: string;

  constructor(private app: App, private sessionManager: SessionManager) {
    this.sessionManager.sessionStateObserver.subscribe(created => this.onSessionStateChanged(created));
  }

  public get ionTabs(): Tabs {
    return this.app.getRootNav().getActiveChildNav() as Tabs;
  }

  private onSessionStateChanged(created: boolean) {
    // Clear state when session is invalidated
    if (!created) {
      this.paymentsBadgeText = "";
    }
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
