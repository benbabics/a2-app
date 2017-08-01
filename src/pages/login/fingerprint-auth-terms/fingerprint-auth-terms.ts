import { Component, Injector } from "@angular/core";
import { Page } from "../../page";
import { Platform, ViewController, NavParams } from "ionic-angular";

@Component({
  selector: "modal-fingerprint-auth-terms",
  templateUrl: "fingerprint-auth-terms.html"
})
export class FingerprintAuthenticationTermsPage extends Page {
  private terms: string;

  constructor(private platform: Platform,
  private viewControl: ViewController,
  private navParams: NavParams,
  injector: Injector) {
    super("Fingerprint Auth Terms", injector);
  }

  public ionViewDidLoad() {
    if (this.platform.is("ios")) {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsIos;
    } else {
      this.terms = this.CONSTANTS.options.scopeVars.CONFIG.termsAndroid;
    }
  }

  private response(accepted: boolean) {
    this.viewControl.dismiss(accepted);
  }
}
