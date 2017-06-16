import { Component } from "@angular/core";
import { Page } from "../../page";
import { Platform } from "ionic-angular";

@Component({
  selector: "modal-fingerprint-auth-terms",
  templateUrl: "fingerprint-auth-terms.html"
})
export class FingerprintAuthenticationTermsPage extends Page {
  private terms: string;
  constructor(private platform: Platform,) {
    super("Fingerprint Auth Terms");
  }

  ionViewDidLoad() {
    if (this.platform.is("ios")) {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsIos;
    } else {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsAndroid;
    }
  }

  getTerms(): string {
      return this.terms;
  }
}
