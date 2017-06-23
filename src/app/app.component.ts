import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { WexNavBar } from "../components";
import { LoginPage } from "../pages/login/login";
import { SessionManager } from "./../providers/session-manager";
import { WexAppSnackbarController } from "../components";

import "chart.js";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private sessionManager: SessionManager, private wexAppSnackbarController: WexAppSnackbarController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      this.sessionManager.restore();
    });
  }

  public get hasSnackbarContent(): boolean {
    return this.wexAppSnackbarController.hasContent;
  }

  public get isUserLoggedIn(): boolean {
    return SessionManager.hasSession;
  }

  public get rootPage() {
    return SessionManager.hasSession ? WexNavBar : LoginPage;
  }
}
