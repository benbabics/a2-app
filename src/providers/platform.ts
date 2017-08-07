import { Platform } from "ionic-angular";
import { Injectable } from "@angular/core";
import { AppConstants } from "../app/app.constants";

const Constants = AppConstants();

@Injectable()
export class WexPlatform {

  constructor(private platform: Platform) { }

  public isAndroid(): boolean {
    return this.os() === Constants.PLATFORM.ANDROID;
  }

  public get isDevMode(): boolean {
    return /[?&]dev/.test(location.search);
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
