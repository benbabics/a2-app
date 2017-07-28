import { Component, Input, Injector } from "@angular/core";
import { InAppBrowser, InAppBrowserObject } from "@ionic-native/in-app-browser";
import { Http } from "@angular/http";
import { Page } from "../../page"
import { GetCurrentEnvironmentConstants, ConstantsInfo } from "../../../app/app.constants";
import { AlertController } from "ionic-angular";
import { Value } from "../../../decorators/value";


@Component({
  selector: "user-enrollment-flow",
  templateUrl: "user-enrollment-flow.html"
})
export class UserEnrollmentFlow extends Page {
  @Input() text: string;
  @Value("APIS.ONLINE_ENROLLMENT.BASE_URL")private ENROLLMENT_URL;
  private ENROLLMENT_PING = this.ENROLLMENT_URL + "ping";

  private isLoading: boolean = false;

  constructor(
              private inAppBrowser: InAppBrowser,
              private http: Http,
              private alertController: AlertController,
              injector: Injector
  ) {
     super("Online Enrollment", injector);
   }

  private handleOpenEnrollmentWindow(): void {
    this.isLoading = true;
    this.http.get( this.ENROLLMENT_PING )
        .subscribe(
            success => this.loadOnlineEnrollmentApp(),
            failure => this.displayServiceUnavailableAlert()
        )
  }

  private loadOnlineEnrollmentApp() {
    this.isLoading = false;
    let browser = this.inAppBrowser.create(this.ENROLLMENT_URL);
    browser.on("loaderror").subscribe(() => this.closeOnlineEnrollmentAppWithErrorAlert(browser));
  }

  private displayServiceUnavailableAlert(browser?: InAppBrowserObject) {
    this.displayErrorAlert(this.CONSTANTS.MESSAGES.ERRORS.serviceUnavailable, browser);
  }

  private closeOnlineEnrollmentAppWithErrorAlert(browser?: InAppBrowserObject) {
    this.displayErrorAlert(this.CONSTANTS.MESSAGES.ERRORS.applicationError, browser);
  }

  private displayErrorAlert(message: string, browser?: InAppBrowserObject) {
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
