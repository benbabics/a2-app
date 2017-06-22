import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";

import { LoginPage } from "../pages/login/login";
import { SessionManager } from "./../providers/session-manager";
import { WexAppBannerController } from "../components";

import "chart.js";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  constructor(keyboard: Keyboard, platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen, private wexAppBannerController: WexAppBannerController, sessionManager: SessionManager) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
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
    return LoginPage;
  }
}
