import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";
import { Value } from "../../decorators/value";
import { WexPlatform } from "../../providers/platform";
import { Observable } from "rxjs";

@Injectable()
export class WexAlertController {
    @Value("BUTTONS") private BUTTONS;

    constructor(private alertController: AlertController, private platform: WexPlatform) { }

    public confirmation(message: string, yesHandler: () => void): Promise<any> {
        return this.alertController.create({
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

    public alert(message: string): Promise<any> {
        return this.alertController.create({
            message,
            buttons: [
                {
                    text: this.platform.constant(this.BUTTONS.ALERT_RESPONSE)
                }
            ]
        }).present();
    }

    public confirmation$(message: string): Observable<any> {
        return new Observable<any>(observer => {
            this.alertController.create({
                message: message,
                buttons: [
                    {
                        text: this.BUTTONS.YES,
                        handler: () => observer.next(true)
                    },
                    {
                        text: this.BUTTONS.NO,
                        handler: () => observer.next(false)
                    }
                ]
            }).present();
        }).take(1);
    }

    public alert$(message: string): Observable<any> {
        return new Observable<any>(observer => {
            this.alertController.create({
                message: message,
                buttons: [
                    {
                        text: this.platform.constant(this.BUTTONS.ALERT_RESPONSE),
                        handler: () => observer.next(true)
                    }
                ]
            }).present();
        }).take(1);
    }
}