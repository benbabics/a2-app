import { Component, Inject, Injector } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";

import { WexNavBar } from "../components";
import { SessionManager } from "./../providers/session-manager";
import { AppSymbols } from "./app.symbols";
import { WexPlatform } from "../providers";

import "chart.js";
import { StatusBar } from "@ionic-native/status-bar";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  private static _injector: Injector;
  public static get injector(): Injector {
    return MyApp._injector;
  }

  constructor(
    splashScreen: SplashScreen,
    statusBar: StatusBar,
    sessionManager: SessionManager,
    private platform: WexPlatform,
    @Inject(AppSymbols.RootPage) public rootPage: any,
    injector: Injector) {
    MyApp._injector = injector;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();

      if (this.platform.isDevMode) {
        sessionManager.restore();
      }
    });

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private onSessionChange(session) {
    if (session && this.platform.isDevMode) {
      this.rootPage = WexNavBar;
    }
  }

  public get isUserLoggedIn(): boolean {
    return SessionManager.hasSession;
  }
}
