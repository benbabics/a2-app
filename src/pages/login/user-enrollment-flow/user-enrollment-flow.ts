import { Component, Input } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
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
    this.http.get( this.ENROLLMENT_PING )
        .subscribe(
            success => this.loadOnlineEnrollmentApp(),
            failure => this.displayServiceUnavailableAlert()
        )
  }

  private loadOnlineEnrollmentApp() {
    let browser = this.inAppBrowser.create(this.ENROLLMENT_URL);
    browser.on("loadstop").subscribe(this.closeOnlineEnrollmentAppWithErrorAlert);
    browser.on("loaderror").subscribe(this.closeOnlineEnrollmentAppWithErrorAlert);
  }

  private displayServiceUnavailableAlert() {
    this.alertController.create({
        subTitle: this.CONSTANTS.MESSAGES.ERRORS.serviceUnavailable,
        buttons: [ConstantsInfo.Common.BUTTONS.OK]
    }).present();
  }

  private closeOnlineEnrollmentAppWithErrorAlert() {
          this.alertController.create({
        subTitle: this.CONSTANTS.MESSAGES.ERRORS.applicationError,
        buttons: [ConstantsInfo.Common.BUTTONS.OK]
    }).present();
  }
}
