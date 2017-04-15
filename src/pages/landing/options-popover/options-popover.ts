import { Component } from "@angular/core";
import { SessionManager } from "../../../providers";
import { App, ViewController } from "ionic-angular";
import { LoginPage } from "../../login/login";

@Component({
  selector: "popover-options",
  templateUrl: "options-popover.html"
})
export class OptionsPopoverPage {

  constructor(private viewCtrl: ViewController, private app: App, private sessionManager: SessionManager) { }

  public close(): Promise<any> {
    return this.viewCtrl.dismiss();
  }

  public onExit() {
    this.close();

    this.app.getRootNav().setRoot(LoginPage)
      .then(() => this.sessionManager.invalidateSession());
  }
}
