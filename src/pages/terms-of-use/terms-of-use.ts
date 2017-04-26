import { Component } from "@angular/core";
import { Page } from "../page";

@Component({
  selector: "page-terms-of-use",
  templateUrl: "terms-of-use.html"
})
export class TermsOfUsePage extends Page {

  constructor() {
    super("Terms of Use");
  }
}
