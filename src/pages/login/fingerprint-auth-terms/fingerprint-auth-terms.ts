import { Component, Injector } from "@angular/core";
import { Page } from "../../page";
import { ViewController } from "ionic-angular";
import { WexPlatform } from "../../../providers";

@Component({
  selector: "modal-fingerprint-auth-terms",
  templateUrl: "fingerprint-auth-terms.html"
})
export class FingerprintAuthenticationTermsPage extends Page {
  public terms: string;

  constructor(
    private platform: WexPlatform,
    private viewControl: ViewController,
    injector: Injector
  ) {
    super("Fingerprint Auth Terms", injector);
  }

  public ionViewDidLoad() {
    if (this.platform.isIos) {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsIos;
    } else {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsAndroid;
    }
  }

  public response(accepted: boolean) {
    this.viewControl.dismiss(accepted);
  }
}
