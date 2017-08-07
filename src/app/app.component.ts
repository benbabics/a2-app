import { Component, Inject } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { WexNavBar } from "../components";
import { SessionManager } from "./../providers/session-manager";
import { AppSymbols } from "./app.symbols";
import { WexPlatform } from "../providers";

import "chart.js";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    sessionManager: SessionManager,
    @Inject(AppSymbols.RootPage) public rootPage: any,
    private wexPlatform: WexPlatform,
    private statusBar: StatusBar
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();

      if (this.wexPlatform.isDevMode) {
        sessionManager.restore();
      }
    });

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private onSessionChange(session) {
    this.statusBar.overlaysWebView(!session);

    if (session && this.wexPlatform.isDevMode) {
      this.rootPage = WexNavBar;
    }
  }

  public get isUserLoggedIn(): boolean {
    return SessionManager.hasSession;
  }
}
