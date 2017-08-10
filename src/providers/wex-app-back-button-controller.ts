import { Platform, App } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class WexAppBackButtonController {
    private action: Function;

    constructor(private platform: Platform, private app: App) {
        this.registerDefault();
        this.platform.registerBackButtonAction(() => this.action(), Number.MAX_SAFE_INTEGER);
    }

    private registerDefault() {
        this.action = () => {
            try {
                this.app.goBack();
            } catch (e) { }
        };
    }

    public registerAction(action: Function) {
        this.action = action;
    }

    public deregisterAction() {
        this.registerDefault();
    }

}