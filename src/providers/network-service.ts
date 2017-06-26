import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";

import { WexAppSnackbarController } from "../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { Value } from "../decorators/value";

@Injectable()
export class NetworkService {
    public static readonly SERVER_ERROR_CODES = [404, 500, 503];
    @Value("GLOBAL_NOTIFICATIONS.networkError") private notification: string;
    @Value("BUTTONS.DISMISS") private dismiss: string;

    constructor(private wexAppSnackbarController: WexAppSnackbarController) {  }

    private isServerConnectionError(response: Response): boolean {
        return _.includes(NetworkService.SERVER_ERROR_CODES, _.get(response, "status"));
    }

    public displayError(response: Response) {
        if (this.isServerConnectionError(response)) {
            this.wexAppSnackbarController.presentToast(this.notification, "red");
        }
    }

}