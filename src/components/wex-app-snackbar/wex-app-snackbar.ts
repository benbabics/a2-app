import { WexAppSnackbarController } from "../wex-app-snackbar-controller/wex-app-snackbar-controller";
import { WexSnackbar, WexSnackbarAction, WEX_SNACKBAR_ANIMATIONS } from "../wex-snackbar/wex-snackbar";
import { Component } from "@angular/core";

@Component({
  selector: "wex-app-snackbar",
  templateUrl: "../wex-snackbar/wex-snackbar.html",
  animations: WEX_SNACKBAR_ANIMATIONS
})
export class WexAppSnackbar extends WexSnackbar {

  constructor(private wexAppSnackbarController: WexAppSnackbarController) {
    super();
  }

  public get text(): string {
    return this.wexAppSnackbarController.text;
  }

  public get buttonTextColor(): string {
    return this.wexAppSnackbarController.buttonTextColor;
  }

  public get action(): WexSnackbarAction {
    return this.wexAppSnackbarController.action;
  }
}
