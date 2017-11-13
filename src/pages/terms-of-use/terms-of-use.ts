import { Component, Injector } from "@angular/core";
import { Page } from "../page";
import { WexAppVersionCheck } from "./../../providers/wex-app-version-check";

@Component({
  selector: "page-terms-of-use",
  templateUrl: "terms-of-use.html"
})
export class TermsOfUsePage extends Page {

  private versionNumber: string;
  public get closing(): string {
    return this.CONSTANTS.closing.replace("$VERSION_NUMBER$", this.versionNumber);
  }

  constructor(injector: Injector, private wexAppVersionCheck: WexAppVersionCheck) {
    super("Terms of Use", injector);
    this.versionNumber = this.wexAppVersionCheck.versionNumber;
  }
}
