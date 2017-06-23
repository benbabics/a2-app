import { WexAppBannerController } from "../wex-app-banner-controller/wex-app-banner-controller";
import { WexSnackbar, WexSnackbarAction, WEX_SNACKBAR_ANIMATIONS } from "../wex-snackbar/wex-snackbar";
import { Component } from "@angular/core";

@Component({
  selector: "wex-app-banner",
  templateUrl: "../wex-snackbar/wex-snackbar.html",
  animations: WEX_SNACKBAR_ANIMATIONS
})
export class WexAppBanner extends WexSnackbar {

  constructor(private wexAppBannerController: WexAppBannerController) {
    super();
  }

  public get text(): string {
    return this.wexAppBannerController.text;
  }

  public get buttonTextColor(): string {
    return this.wexAppBannerController.buttonTextColor;
  }

  public get action(): WexSnackbarAction {
    return this.wexAppBannerController.action;
  }
}
