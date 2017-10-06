import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { ToastController, ToastOptions, Toast, NavOptions, App, Config } from "ionic-angular";
import { AppConstants } from "../../app/app.constants";

const Constants = AppConstants();
type ToastCallback =  (data: any, role: string) => void;

export interface QueuedToastOptions extends ToastOptions {
  important?: boolean;
}

export class QueuedToast {


  constructor(public readonly toast: Toast, private controller: WexAppSnackbarController, public readonly options: QueuedToastOptions) { }

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

  private _queue: Promise<any> = Promise.resolve();
  private activeToast: QueuedToast;

  private updateQueueChain(): Promise<any> {
    if (this.activeToast && !this.activeToast.options.important) {
      let toast = this.activeToast;
      this.activeToast = undefined;

      return toast.dismiss().then(() => this.updateQueueChain());
    }
    else {
      return Promise.resolve();
    }
  }

  constructor(app: App, config: Config) {
    super(app, config);

    // Update the queue chain after each page change
    app.viewWillLeave.subscribe(() => this.updateQueueChain());
  }

  public create(options: ToastOptions): Toast {
    return super.create(_.merge({}, WexAppSnackbarController.DefaultOptions, options));
  }

  public createQueued(options: QueuedToastOptions): QueuedToast {
    return new QueuedToast(this.create(options), this, options);
  }

  public get queue(): Promise<any> {
    return this._queue;
  }

  public presentQueued(toast: QueuedToast, navOptions?: NavOptions): Promise<any> {
    let queueHead = this.queue;

    return this._queue = this.updateQueueChain() // Update the queue
      .then(() => queueHead) // Wait until the queue is empty
      .then(() => {
        this.activeToast = toast;
        return this.activeToast.toast.present(navOptions); // Present the toast
      })
      .then(() => new Promise(resolve => toast.onWillDismiss(resolve))); // Add this toast to the queue
  }
}

export namespace WexAppSnackbarController {

  export const DefaultOptions: ToastOptions = {
    position: "top",
    showCloseButton: false,
    closeButtonText: Constants.BUTTONS.DISMISS,
  };
}
