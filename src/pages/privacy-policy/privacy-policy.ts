import { AppVersion } from "@ionic-native/app-version";
import { Component } from "@angular/core";
import { Page } from "../page";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@Component({
  selector: "page-privacy-policy",
  templateUrl: "privacy-policy.html"
})
export class PrivacyPolicyPage extends Page {
  private sectionVisibility: boolean[];

  private closing: string;
  private versionNumber: string;

  constructor(private appVersion: AppVersion, private inAppBrowser: InAppBrowser) {
    super("Privacy Policy");
    this.sectionVisibility = new Array<boolean>(14);
  }

  private openUrl(url: string): void {
    this.inAppBrowser.create(url);
  }

  ionViewDidLoad(): void {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.versionNumber = versionNumber;
        this.closing = this.CONSTANTS.closing.replace("$VERSION_NUMBER$", versionNumber);
      });
  }

  private sectionIsVisible(sectionNumber: number): boolean {
    return this.sectionVisibility[sectionNumber];
  }

  private sectionIsHidden(sectionNumber: number): boolean {
    return !this.sectionVisibility[sectionNumber];
  }

  private toggleSectionVisibility(sectionNumber: number): void {
    this.sectionVisibility[sectionNumber] = !this.sectionVisibility[sectionNumber];
  }
}
