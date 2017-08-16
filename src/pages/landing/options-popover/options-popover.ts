import { Component } from "@angular/core";
import { SessionManager, Fingerprint } from "../../../providers";
import { App, ViewController, Platform } from "ionic-angular";
import { ContactUsPage } from "../../contact-us/contact-us";
import { SettingsPage } from "../../settings/settings";
import { TermsOfUsePage } from "../../terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../../privacy-policy/privacy-policy";

@Component({
  selector: "popover-options",
  templateUrl: "options-popover.html"
})
export class OptionsPopoverPage {

  public fingerprintAuthAvailable: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    private app: App,
    private sessionManager: SessionManager,
    private platform: Platform,
    private fingerprint: Fingerprint
  ) { }

  ionViewWillEnter() {
    // check if fingerprint is enabled
    this.doFingerprintAuthCheck();
  }

  public close(): Promise<any> {
    return this.viewCtrl.dismiss();
  }

  public goToSettingsPage() {
    this.close();

    return this.app.getActiveNav().push( SettingsPage );
  }

  public goToTermsOfUsePage() {
    this.close();

    return this.app.getActiveNav().push(TermsOfUsePage);
  }

  public goToContactUsPage() {
    this.close();

    return this.app.getActiveNav().push(ContactUsPage);
  }

  public goToPrivacyPolicyPage() {
    this.close();

    return this.app.getActiveNav().push(PrivacyPolicyPage);
  }

  public onExit() {
    this.close();

    this.sessionManager.logout({ "fromLogOut": true });
  }

  private doFingerprintAuthCheck(): void {
    this.platform.ready()
      .then(() => this.fingerprint.isAvailable)
      .then(() => this.fingerprintAuthAvailable = true);
  }
}
