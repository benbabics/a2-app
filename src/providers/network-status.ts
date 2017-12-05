import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Network } from "@ionic-native/network";
import * as ConnectionConstants from "cordova-plugin-network-information/www/Connection";

import { WexAppSnackbarController, QueuedToast } from "../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { Value } from "../decorators/value";
import { WexPlatform } from "./platform";

@Injectable()
export class NetworkStatus {
    public static readonly SERVER_ERROR_CODES = [0, 404, 500, 503];

    @Value("GLOBAL_NOTIFICATIONS.serverConnectionError") private serverError: string;
    @Value("GLOBAL_NOTIFICATIONS.networkError") private networkError: string;
    private networkErrorToast: QueuedToast;
    private get noConnectionAvailable(): boolean {
      return this.network.type === ConnectionConstants.NONE;
    }

    constructor(private wexAppSnackbarController: WexAppSnackbarController, private network: Network, private platform: WexPlatform) {
        this.watchConnectionErrors();
        if (!this.platform.isIos) {
          this.platform.ready(() => this.onResumeSubscription());
        }
    }

    private onResumeSubscription() {
      this.platform.resume.subscribe(() => {
        console.warn("Connection type onResume: " + this.network.type);
        if (this.noConnectionAvailable) {
          if (!this.networkErrorToast) {
            this.networkErrorToast = this.createErrorToast(this.networkError, true);
            this.networkErrorToast.present();
          }
        } else {
          if (!!this.networkErrorToast) {
            this.networkErrorToast.dismiss();
            this.networkErrorToast = null;
          }
        }
      });
    }

    private createErrorToast(message: string, important?: boolean): QueuedToast {
      const cssClass = "red";

      return this.wexAppSnackbarController.createQueued({ message, cssClass, showCloseButton: true, important });
    }

    private watchConnectionErrors() {
      this.network.onDisconnect().subscribe(() => {
        console.warn("Connection type onDisconnect: " + this.network.type);
        if (!this.networkErrorToast && (this.noConnectionAvailable || this.platform.isIos)) {
          this.networkErrorToast = this.createErrorToast(this.networkError, true);
          this.networkErrorToast.present();
        }
      });

      this.network.onConnect().subscribe(() => {
        console.warn("Connection type onConnect: " + this.network.type);
        if (!!this.networkErrorToast && (!this.noConnectionAvailable || this.platform.isIos)) {
          this.networkErrorToast.dismiss();
          this.networkErrorToast = null;
        }
      });
    }

    private isServerConnectionError(response: Response): boolean {
        return _.includes(NetworkStatus.SERVER_ERROR_CODES, _.get(response, "status"));
    }

    public displayError(response: Response) {
        if (this.isServerConnectionError(response)) {
            this.createErrorToast(this.serverError).present();
        }
    }
}
