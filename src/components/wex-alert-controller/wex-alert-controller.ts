import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";
import { Value } from "../../decorators/value";
import { WexPlatform } from "../../providers/platform";

@Injectable()
export class WexAlertController {
    @Value("BUTTONS") private BUTTONS;

    constructor(private alertController: AlertController, private platform: WexPlatform) { }

    public confirmation(message: string, yesHandler: () => void) {
        this.alertController.create({
            message,
            buttons: [
                {
                    text: this.BUTTONS.YES,
                    handler: yesHandler
                },
                {
                    text: this.BUTTONS.NO
                }
            ]
        }).present();
    }

    public alert(message: string) {
        this.alertController.create({
            message,
            buttons: [
                {
                    text: this.platform.constant(this.BUTTONS.ALERT_RESPONSE)
                }
            ]
        }).present();
    }
}