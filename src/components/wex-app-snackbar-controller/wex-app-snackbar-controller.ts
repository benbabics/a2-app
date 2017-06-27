import { Injectable } from "@angular/core";
import { ToastController, ToastOptions } from "ionic-angular";
import { Value } from "../../decorators/value";

@Injectable()
export class WexAppSnackbarController extends ToastController {
  @Value("BUTTONS.DISMISS") private dismiss: string;

  public get standardOptions(): ToastOptions {
    return {
      position: "top",
      showCloseButton: true,
      closeButtonText: this.dismiss,
    }
  }

  public presentToast (text: string, color?: string, closeAction?: (data: any, role: string) => void) {
    let options = this.standardOptions;
    options.message = text;

    // color classes found in app.scss
    if (color) {
      options.cssClass = color;
    }

    let toast = super.create(options);
    if (closeAction) {
      toast.onDidDismiss(closeAction)
    }
    toast.present();
  }
}
