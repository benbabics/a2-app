import { Component, Injector } from "@angular/core";
import { Page } from "../../page";
import { NavParams, ViewController } from "ionic-angular";
import { VersionStatus } from "@angular-wex/models";
import { WexPlatform } from "../../../providers/platform";
import { Market } from "@ionic-native/market";
import { WexAppBackButtonController } from "../../../providers/wex-app-back-button-controller";
import { PageTheme, StatusBarStyle } from "../../../decorators/status-bar";

@StatusBarStyle(PageTheme.Light)
@Component({
  selector: "version-check",
  templateUrl: "version-check.html"
}) export class VersionCheck extends Page {
  public status: VersionStatus;

  constructor(private viewController: ViewController,
    private wexPlatform: WexPlatform,
    private market: Market,
    private wexAppBackButtonController: WexAppBackButtonController,
    navParams: NavParams,
    injector: Injector
  ) {
    super("Version Check", injector);
    this.status = navParams.get("status") as VersionStatus;
    if (this.status === VersionStatus.Unsupported) {
      this.wexAppBackButtonController.registerAction(() => { });
    }
  }

  public get canSkipUpdate() {
    return this.status !== VersionStatus.Unsupported;
  }

  public skipUpdate() {
    this.viewController.dismiss();
  }

  public update() {
    this.market.open(this.CONSTANTS.APP_STORES[this.wexPlatform.os]);
  }


}