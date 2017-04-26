import { AppVersion } from "@ionic-native/app-version";
import { Component } from "@angular/core";
import { Page } from "../page";

@Component({
  selector: "page-terms-of-use",
  templateUrl: "terms-of-use.html"
})
export class TermsOfUsePage extends Page {

  private closing: string;

  constructor(private appVersion: AppVersion) {
    super("Terms of Use");
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.closing = this.CONSTANTS.closing.replace("$VERSION_NUMBER$", versionNumber);
      });
  }
}
