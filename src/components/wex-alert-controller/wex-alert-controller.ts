import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Value } from '../../decorators/value';

@Injectable()
export class WexAlertController {
    @Value("BUTTONS") private BUTTONS;

    constructor(private alertController: AlertController) { }

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
}