import { Platform, App } from "ionic-angular";
import { Injectable, Injector, Inject, forwardRef } from "@angular/core";
import { AppConstants } from "../app/app.constants";
import { LoginPage } from "../pages/login/login";
import { SessionManager } from "./session-manager";

const Constants = AppConstants();

@Injectable()
export class WexPlatform {

  constructor(
    private platform: Platform,
    @Inject(forwardRef(() => App)) private app: App
  ) { }

  public isAndroid(): boolean {
    return this.os() === Constants.PLATFORM.ANDROID;
  }

  public isMock(): boolean {
    return this.os() === Constants.PLATFORM.MOCK;
  }

  public isIos(): boolean {
    return this.os() === Constants.PLATFORM.IOS;
  }

  public isOs(os: string): boolean {
    return os.toLowerCase() === this.os();
  }

  public logout(params?: any) {
    this.app.getRootNav().setRoot(LoginPage, params)
      //.then(() => this.sessionManager.invalidateSession());
  }

  public os(): string {
    if (this.platform.platforms().indexOf(Constants.PLATFORM.ANDROID) !== -1) {
      return Constants.PLATFORM.ANDROID;
    }

    if (this.platform.platforms().indexOf(Constants.PLATFORM.IOS) !== -1) {
      return Constants.PLATFORM.IOS;
    }

    return Constants.PLATFORM.MOCK;
  }
}
