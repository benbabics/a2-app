import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Network } from "@ionic-native/network";

import { WexAppSnackbarController, QueuedToast } from "../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { Value } from "../decorators/value";

@Injectable()
export class NetworkStatus {
    public static readonly SERVER_ERROR_CODES = [404, 500, 503];

    @Value("GLOBAL_NOTIFICATIONS.serverConnectionError") private serverError: string;
    @Value("GLOBAL_NOTIFICATIONS.networkError") private networkError: string;

    constructor(private wexAppSnackbarController: WexAppSnackbarController, private network: Network) {
        this.watchConnectionErrors();
    }

    private createErrorToast(message: string): QueuedToast {
      return this.wexAppSnackbarController.createQueued({
        message: message,
        cssClass: "red"
      });
    }

    private watchConnectionErrors() {
      let toast: QueuedToast;

      this.network.onDisconnect().subscribe(() => {
        toast = this.createErrorToast(this.networkError);
        toast.present();
      });

      this.network.onConnect().subscribe(() => {
        if (toast) {
          toast.dismiss();
          toast = null;
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
