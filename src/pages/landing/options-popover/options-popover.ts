import { Component } from "@angular/core";
import { SessionManager } from "../../../providers";
import { App, ViewController } from "ionic-angular";
import { LoginPage } from "../../login/login";
import { TermsOfUsePage } from "../../terms-of-use/terms-of-use";

@Component({
  selector: "popover-options",
  templateUrl: "options-popover.html"
})
export class OptionsPopoverPage {

  constructor(private viewCtrl: ViewController, private app: App, private sessionManager: SessionManager) { }

  public close(): Promise<any> {
    return this.viewCtrl.dismiss();
  }

  public goToTermsOfUsePage() {
    this.close();

    return this.app.getActiveNav().push(TermsOfUsePage);
  }

  public onExit() {
    this.close();

    this.app.getRootNav().setRoot(LoginPage, { "fromLogOut": true })
      .then(() => this.sessionManager.invalidateSession());
  }
}
