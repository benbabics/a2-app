import { Component, Injector } from "@angular/core";
import { Page } from "../page";
import { WexPlatform } from "../../providers/platform";
import { WexAppVersionCheck } from "./../../providers/wex-app-version-check";

@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage extends Page {

  private versionNumber: string;

  public get sendEmailLink(): string {
    return this.CONSTANTS.sendEmailLink + this.versionNumber;
  }

  constructor(public platform: WexPlatform, injector: Injector, private wexAppVersionCheck: WexAppVersionCheck) {
    super("Contact Us", injector);
    this.versionNumber = this.wexAppVersionCheck.versionNumber;
  }
}
