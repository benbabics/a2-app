import { AppVersion } from "@ionic-native/app-version";
import { Component, Injector } from "@angular/core";
import { Page } from "../page";

@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage extends Page {
  private sendEmailLink: string;

  constructor(private appVersion: AppVersion, injector: Injector) {
    super("Contact Us", injector);
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber()
      .then((versionNumber: string) => {
        this.sendEmailLink = this.CONSTANTS.sendEmailLink + versionNumber;
      });
  }
}
