import { Injector, Component, OnDestroy } from "@angular/core";
import { ContactUsPage } from "../contact-us/contact-us";
import { TermsOfUsePage } from "../terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy";
import { NavController } from "ionic-angular";
import { FingerprintController } from "./fingerprint-control";
import { WexNavigationController, WexPlatform } from "../../providers";
import { NavBarController } from "../../providers/nav-bar-controller";

@Component({
  selector: "options-page",
  templateUrl: "./options.html"
})
export class OptionsPage extends FingerprintController implements OnDestroy {
  public readonly pages = { ContactUsPage, TermsOfUsePage, PrivacyPolicyPage };
  public fingerprintAuthAvailable: boolean = false;

  constructor(injector: Injector,
    private navController: NavController,
    private wexNavigationController: WexNavigationController,
    private navBarController: NavBarController,
    public platform: WexPlatform
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
    // Hide navbar if on Android
    if (!this.platform.isIos) {
      this.navBarController.show(false);
    }
    this.platform.ready(() => this.fingerprint.isAvailable
        .then(() => this.fingerprintAuthAvailable = true));
    super.ionViewWillEnter();
  }

  public ngOnDestroy() {
    // Replace hidden navbar if on Android
    if (!this.platform.isIos) {
      this.navBarController.show(true);
    }
  }
}