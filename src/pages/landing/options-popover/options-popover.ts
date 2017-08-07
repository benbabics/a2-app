import { Component } from "@angular/core";
import { SessionManager, WexPlatform } from "../../../providers";
import { App, ViewController } from "ionic-angular";
import { ContactUsPage } from "../../contact-us/contact-us";
import { LoginPage } from "../../login/login";
import { SettingsPage } from '../../settings/settings';
import { TermsOfUsePage } from "../../terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../../privacy-policy/privacy-policy";

@Component({
  selector: "popover-options",
  templateUrl: "options-popover.html"
})
export class OptionsPopoverPage {

  constructor(private viewCtrl: ViewController, private app: App, private platform: WexPlatform) { }

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

    this.platform.logout({ "fromLogOut": true });
  }
}
