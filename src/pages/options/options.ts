import { Injector, Component } from "@angular/core";
import { ContactUsPage } from "../contact-us/contact-us";
import { TermsOfUsePage } from "../terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy";
import { NavController } from "ionic-angular";
import { FingerprintController } from "./fingerprint-control";
import { WexNavigationController } from "../../providers";

@Component({
  selector: "options-page",
  templateUrl: "./options.html"
})
export class OptionsPage extends FingerprintController {
  public readonly pages = { ContactUsPage, TermsOfUsePage, PrivacyPolicyPage };
  public fingerprintAuthAvailable: boolean = false;

  constructor(injector: Injector,
    private navController: NavController,
    private wexNavigationController: WexNavigationController
  ) {
    super("Options", injector);
  }

  public get switchColor(): string {
    return this.platform.isIos ? "ion-toggle-ios" : "";
  }

  public goToPage(page) {
    this.navController.push(page);
  }

  public logout() {
    this.wexNavigationController.logout({ "fromLogOut": true });
  }

  public ionViewWillEnter(): void {
    if (!this.platform.isMock) {
      this.platform.ready()
        .then(() => this.fingerprint.isAvailable)
        .then(() => this.fingerprintAuthAvailable = true);
    }
    super.ionViewWillEnter();
  }
}