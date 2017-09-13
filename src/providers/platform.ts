import { Platform } from "ionic-angular";
import { Injectable } from "@angular/core";
import { AppConstants } from "../app/app.constants";
import { Value } from "../decorators/value";

const Constants = AppConstants();

export type PlatformSpecificConstant = { android: string, ios: string };

@Injectable()
export class WexPlatform extends Platform {

  @Value("IONIC_APP_ID") private IONIC_APP_ID: string;
  @Value("PLATFORM_BIOMETRIC") private PLATFORM_BIOMETRIC: PlatformSpecificConstant;
  private static readonly DEV_MODE_REGEX: RegExp = /[?&]dev/;
  private static readonly MOCK_REGEX: RegExp = /^http(s?):\/\//;

  constructor(platform: Platform) {
    super();

    Object.assign(this, platform);
  }

  public get isAndroid(): boolean {
    return this.os === Constants.PLATFORM.ANDROID;
  }

  public get isDevMode(): boolean {
    return WexPlatform.DEV_MODE_REGEX.test(location.search);
  }

  public get isMock(): boolean {
    return this.os === Constants.PLATFORM.MOCK || WexPlatform.MOCK_REGEX.test(document.URL) || this.isIonicWebView;
  }

  public get isIos(): boolean {
    return this.os === Constants.PLATFORM.IOS;
  }

  public get os(): string {
    if (this.platforms().indexOf(Constants.PLATFORM.ANDROID) !== -1) {
      return Constants.PLATFORM.ANDROID;
    }

    if (this.platforms().indexOf(Constants.PLATFORM.IOS) !== -1) {
      return Constants.PLATFORM.IOS;
    }

    return Constants.PLATFORM.MOCK;
  }

  public isOs(os: string): boolean {
    return os.toLowerCase() === this.os;
  }

  public get isIonicWebView(): boolean {
    return window.location.href.indexOf("com.ionic.viewapp") > -1 || window.location.href.indexOf(this.IONIC_APP_ID) > -1;
  }

  public biometricTitle(lowercaseAndroid?: boolean) {
    if (this.isIos) {
      return this.PLATFORM_BIOMETRIC.ios;
    } else {
      return lowercaseAndroid ? this.PLATFORM_BIOMETRIC.android.toLocaleLowerCase() : this.PLATFORM_BIOMETRIC.android;
    }
  }

  public constant(constant: PlatformSpecificConstant) {
    return this.isIos ? constant.ios : constant.android;
  }
}
