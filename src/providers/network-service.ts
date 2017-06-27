import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Network } from "@ionic-native/network";
import { Toast } from "ionic-angular";

import { WexAppSnackbarController } from "../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { Value } from "../decorators/value";

@Injectable()
export class NetworkService {
    public static readonly SERVER_ERROR_CODES = [404, 500, 503];
    @Value("GLOBAL_NOTIFICATIONS.serverConnectionError") private notification: string;
    @Value("GLOBAL_NOTIFICATIONS.networkError") private networkError: string;

    constructor(private wexAppSnackbarController: WexAppSnackbarController, private network: Network) {
        let toastContainer: {toast: Toast};
        this.network.onDisconnect().subscribe(() => {
            toastContainer = {
            toast: this.wexAppSnackbarController.create({
                message: this.networkError,
                position: "top",
                cssClass: "red"
            })};
            toastContainer.toast.present();});
        this.network.onConnect().subscribe(() => toastContainer.toast.dismiss());

     }

    private isServerConnectionError(response: Response): boolean {
        return _.includes(NetworkService.SERVER_ERROR_CODES, _.get(response, "status"));
    }

    public displayError(response: Response) {
        if (this.isServerConnectionError(response)) {
            this.wexAppSnackbarController.presentToast(this.notification, "red");
        }
    }
}