import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";

import { WexNavBar } from "../components";
import { LoginPage } from "../pages/login/login";
import { SessionManager } from "./../providers/session-manager";
import { WexAppBannerController } from "../components";

import "chart.js";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  constructor(keyboard: Keyboard, platform: Platform, splashScreen: SplashScreen, private statusBar: StatusBar, private sessionManager: SessionManager, private wexAppBannerController: WexAppBannerController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      this.sessionManager.restore();
      keyboard.disableScroll(true);
    });

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private onSessionChange(session) {
    if (session) {
      this.statusBar.overlaysWebView(false);
    }
    else {
      this.statusBar.overlaysWebView(true);
    }
  }

  public get hasBannerContent(): boolean {
    return this.wexAppBannerController.hasContent;
  }

  public get isUserLoggedIn(): boolean {
    return SessionManager.hasSession;
  }

  public get rootPage() {
    return SessionManager.hasSession ? WexNavBar : LoginPage;
  }
}
