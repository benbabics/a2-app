import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { ToastController, ToastOptions, Toast, NavOptions } from "ionic-angular";
import { AppConstants } from "../../app/app.constants";

const Constants = AppConstants();
type ToastCallback =  (data: any, role: string) => void;

export class QueuedToast {

  constructor(public readonly toast: Toast, private controller: WexAppSnackbarController) { }

  private didDismissCallbacks: Array<ToastCallback> = [];
  private willDismissCallbacks: Array<ToastCallback> = [];

  public dismiss(data?: any, role?: string, navOptions?: NavOptions) {
    return this.toast.dismiss(data, role, navOptions);
  }

  public onDidDismiss(callback: (data: any, role: string) => void) {
    this.didDismissCallbacks.push(callback);
    return this.toast.onDidDismiss(_.flowRight<ToastCallback>(this.didDismissCallbacks));  
  }

  public onWillDismiss(callback: (data: any, role: string) => void) {
    this.willDismissCallbacks.push(callback);
    return this.toast.onWillDismiss(_.flowRight<ToastCallback>(this.willDismissCallbacks));  
  }

  public present(navOptions?: NavOptions): Promise<any> {
    return this.controller.presentQueued(this, navOptions);
  }
}

@Injectable()
export class WexAppSnackbarController extends ToastController {

  private _toastDisplaySychronizer: Promise<any> | null;

  public create(options: ToastOptions): Toast {
    return super.create(_.merge({}, WexAppSnackbarController.DefaultOptions, options));
  }

  public createQueued(options: ToastOptions): QueuedToast {
    return new QueuedToast(this.create(options), this);
  }

  public get toastDisplaySychronizer(): Promise<any> {
    return this._toastDisplaySychronizer || Promise.resolve();
  }

  public presentQueued(queuedToast: QueuedToast, navOptions?: NavOptions): Promise<any> {
    let presentPromise = this.toastDisplaySychronizer.then(() => queuedToast.toast.present(navOptions));

    // Add a wait for this toast message to the queue
    this._toastDisplaySychronizer = presentPromise
      .then(() => new Promise((resolve, reject) => queuedToast.onDidDismiss(resolve)))
      .then(() => this._toastDisplaySychronizer = null);

    return presentPromise;
  }
}

export namespace WexAppSnackbarController {

  export const DefaultOptions: ToastOptions = {
    position: "top",
    showCloseButton: false,
    closeButtonText: Constants.BUTTONS.DISMISS,
  };
}
