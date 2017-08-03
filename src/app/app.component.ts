import { Component, Injector } from "@angular/core";
import { Platform, NavController, IonicApp } from 'ionic-angular';
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { WexNavBar } from "../components";
import { LoginPage } from "../pages/login/login";
import { SessionManager } from "./../providers/session-manager";

import "chart.js";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  private static _injector: Injector;
  public static get injector(): Injector {
    return MyApp._injector;
  }

  constructor(platform: Platform,
    splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sessionManager: SessionManager,
    private injector: Injector) {
    MyApp._injector = injector;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      this.sessionManager.restore();
    });

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private onSessionChange(session) {
    this.statusBar.overlaysWebView(!session);
  }


  public get isUserLoggedIn(): boolean {
    return SessionManager.hasSession;
  }

  public get rootPage() {
    return SessionManager.hasSession ? WexNavBar : LoginPage;
  }
}
