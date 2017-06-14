import { AppVersion } from "@ionic-native/app-version";
import { Component, ViewChild } from "@angular/core";
import { Page } from "../page";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Content } from "ionic-angular";

@Component({
  selector: "page-privacy-policy",
  templateUrl: "privacy-policy.html"
})
export class PrivacyPolicyPage extends Page {
  @ViewChild(Content) content: Content;

  private closing: string;
  private versionNumber: string;

  constructor(private appVersion: AppVersion, private inAppBrowser: InAppBrowser) {
    super("Privacy Policy");
  }

  openUrl(url: string) {
    this.inAppBrowser.create(url);
  }

  scrollTo(section: HTMLElement) {
    this.content.scrollTo(0, section.offsetTop, 500);
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.versionNumber = versionNumber;
        this.closing = this.CONSTANTS.closing.replace("$VERSION_NUMBER$", versionNumber);
      });
  }
}
