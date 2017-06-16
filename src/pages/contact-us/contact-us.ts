import { AppVersion } from "@ionic-native/app-version";
import { Component } from "@angular/core";
import { Page } from "../page";

@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage extends Page {
  private sendEmailLink: string;

  constructor(private appVersion: AppVersion) {
    super("Contact Us");
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.sendEmailLink = this.CONSTANTS.sendEmailLink + versionNumber;
      });
  }
}
