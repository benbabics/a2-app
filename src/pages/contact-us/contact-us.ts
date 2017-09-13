import { Component, Injector } from "@angular/core";
import { Page } from "../page";
import { Value } from "../../decorators/value";
import { WexPlatform } from "../../providers/platform";

@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage extends Page {
  @Value("VERSION_NUMBER") private VERSION_NUMBER: string;
  public get sendEmailLink(): string {
    return this.CONSTANTS.sendEmailLink + this.VERSION_NUMBER;
  }

  constructor(public platform: WexPlatform, injector: Injector) {
    super("Contact Us", injector);
  }
}
