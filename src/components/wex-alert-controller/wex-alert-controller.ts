import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";
import { Value } from "../../decorators/value";
import { WexPlatform } from "../../providers/platform";
import { Observable } from "rxjs";

@Injectable()
export class WexAlertController {
    @Value("BUTTONS") private BUTTONS;

    constructor(private alertController: AlertController, private platform: WexPlatform) { }

    public confirmation(message: string): Observable<any> {
        return new Observable<any>(observer => {
            this.alertController.create({
                message: message,
                buttons: [
                    {
                        text: this.BUTTONS.YES,
                        handler: (...args) => observer.next(...args)
                    },
                    {
                        text: this.BUTTONS.NO,
                        handler: (...args) => observer.error(...args)
                    }
                ]
            }).present();
        }).shareReplay(1);
    }

    public alert(message: string): Observable<any> {
        return new Observable<any>(observer => {
            this.alertController.create({
                message: message,
                buttons: [
                    {
                        text: this.platform.constant(this.BUTTONS.ALERT_RESPONSE),
                        handler: (...args) => observer.next(...args)
                    }
                ]
            }).present();
        }).shareReplay(1);
        
    }
}