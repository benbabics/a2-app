import { AppVersion } from "@ionic-native/app-version";
import { Component } from "@angular/core";
import { Page } from "../page";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@Component({
  selector: "page-privacy-policy",
  templateUrl: "privacy-policy.html"
})
export class PrivacyPolicyPage extends Page {
  private section: boolean[];

  private closing: string;
  private versionNumber: string;

  constructor(private appVersion: AppVersion, private inAppBrowser: InAppBrowser) {
    super("Privacy Policy");
    this.section = new Array<boolean>(14);
  }

  openUrl(url: string) {
    this.inAppBrowser.create(url);
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.versionNumber = versionNumber;
        this.closing = this.CONSTANTS.closing.replace("$VERSION_NUMBER$", versionNumber);
      });
  }
}
