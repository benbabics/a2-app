import { Component, Injector } from "@angular/core";
import { Page } from "../page";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { WexAppVersionCheck } from "../../providers/wex-app-version-check";

@Component({
  selector: "page-privacy-policy",
  templateUrl: "privacy-policy.html"
})
export class PrivacyPolicyPage extends Page {
  private sectionVisibility: boolean[];

  private versionNumber: string;
  public get closing(): string {
    return this.CONSTANTS.closing.replace("$VERSION_NUMBER$", this.versionNumber);
  }

  constructor(private inAppBrowser: InAppBrowser,
              injector: Injector,
              private wexAppVersionCheck: WexAppVersionCheck) {
    super("Privacy Policy", injector);
    this.sectionVisibility = new Array<boolean>(14);
    this.versionNumber = this.wexAppVersionCheck.versionNumber;
  }

  public openUrl(url: string): void {
    this.inAppBrowser.create(url);
  }

  public sectionIsVisible(sectionNumber: number): boolean {
    return this.sectionVisibility[sectionNumber];
  }

  public sectionIsHidden(sectionNumber: number): boolean {
    return !this.sectionVisibility[sectionNumber];
  }

  public toggleSectionVisibility(sectionNumber: number): void {
    this.sectionVisibility[sectionNumber] = !this.sectionVisibility[sectionNumber];
  }
}
