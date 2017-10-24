import { Component, Injector } from "@angular/core";
import { Page } from "../page";
import { Value } from "../../decorators/value";

@Component({
  selector: "page-terms-of-use",
  templateUrl: "terms-of-use.html"
})
export class TermsOfUsePage extends Page {

  @Value("VERSION_NUMBER") private versionNumber: string;
  public get closing(): string {
    return this.CONSTANTS.closing.replace("$VERSION_NUMBER$", this.versionNumber);
  }

  constructor(injector: Injector) {
    super("Terms of Use", injector);
  }
}
