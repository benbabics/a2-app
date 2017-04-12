import { Platform }from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class WexPlatform {

  public static readonly ANDROID = "android";
  public static readonly IOS = "ios";
  public static readonly BROWSER = "browser";

  constructor(private platform: Platform) { }

  public isAndroid(): boolean {
    return this.os() === WexPlatform.ANDROID;
  }

  public isBrowser(): boolean {
    return this.os() === WexPlatform.BROWSER;
  }

  public isIos(): boolean {
    return this.os() === WexPlatform.IOS;
  }

  public os(): string {
    if (this.platform.platforms().indexOf(WexPlatform.ANDROID) !== -1) {
      return WexPlatform.ANDROID;
    }

    if (this.platform.platforms().indexOf(WexPlatform.IOS) !== -1) {
      return WexPlatform.IOS;
    }

    return WexPlatform.BROWSER;
  }
}
