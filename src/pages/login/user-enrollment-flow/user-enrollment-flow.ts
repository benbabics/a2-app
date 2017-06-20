import { Component, Input } from "@angular/core";
import { InAppBrowser, InAppBrowserObject } from "@ionic-native/in-app-browser";
import { Http } from "@angular/http";
import { Page } from "../../page"
import { GetCurrentEnvironmentConstants, ConstantsInfo } from "../../../app/app.constants";
import { AlertController } from "ionic-angular";


@Component({
  selector: "user-enrollment-flow",
  templateUrl: "user-enrollment-flow.html"
})
export class UserEnrollmentFlow extends Page {
  @Input() text: string;

  private isLoading: boolean = false;

  private ENROLLMENT_URL = (GetCurrentEnvironmentConstants().APIS as any).ONLINE_ENROLLMENT.BASE_URL;
  private ENROLLMENT_PING = this.ENROLLMENT_URL + "ping";

  constructor(
              private inAppBrowser: InAppBrowser,
              private http: Http,
              private alertController: AlertController
  ) {
     super("Online Enrollment");
   }

  private handleOpenEnrollmentWindow(): void {
    this.isLoading = true;
    this.http.get( this.ENROLLMENT_PING )
        .subscribe(
            success => this.loadOnlineEnrollmentApp(),
            failure => this.displayServiceUnavailableAlert(null)
        )
  }

  private loadOnlineEnrollmentApp() {
    this.isLoading = false;
    let browser = this.inAppBrowser.create(this.ENROLLMENT_URL);
    browser.on("loaderror").subscribe(() => this.closeOnlineEnrollmentAppWithErrorAlert(browser));
  }

  private displayServiceUnavailableAlert(browser: InAppBrowserObject) {
    this.displayErrorAlert(this.CONSTANTS.MESSAGES.ERRORS.serviceUnavailable, browser);
  }

  private closeOnlineEnrollmentAppWithErrorAlert(browser: InAppBrowserObject) {
    this.displayErrorAlert(this.CONSTANTS.MESSAGES.ERRORS.applicationError, browser);
  }

  private displayErrorAlert(message: string, browser: InAppBrowserObject) {
    if (browser) {
      browser.close();
    }
    this.alertController.create({
      subTitle: message,
      buttons: [ConstantsInfo.Common.BUTTONS.OK]
    }).present();
    this.isLoading = false;
  }
}
