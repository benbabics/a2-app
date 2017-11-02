import { Injectable } from "@angular/core";
import { AppVersion } from "@ionic-native/app-version";
import { Observable } from "rxjs";
import { Value } from "../decorators/value";
import { VersionStatus } from "@angular-wex/models";
import { WexPlatform } from "./platform";
import { VersionStatusProvider } from "@angular-wex/api-providers";
import { ConstantsInfo } from "../app/app.constants";

export namespace RequestPlatform {
  export const Android = "ANDROID";
  export const iOS = "IOS";
  export const Mock = "MOCK";
}

@Injectable()
export class WexAppVersionCheck {

  @Value("AUTH.client_id") clientId: string;
  private _status: Observable<VersionStatus>;

  public get status(): Observable<VersionStatus> {
    return this._status;
  }

  public get versionNumber(): string {
    return ConstantsInfo.Common.VERSION_NUMBER;
  }

  private get platformName(): string {
    if (this.wexPlatform.isAndroid) {
      return RequestPlatform.Android;
    } else if (this.wexPlatform.isIos) {
      return RequestPlatform.iOS;
    } else {
      return RequestPlatform.Mock;
    }
  }

  constructor(
    private appVersion: AppVersion,
    private wexPlatform: WexPlatform,
    private versionStatusProvider: VersionStatusProvider
  ) {
    this._status = this.checkVersionStatus();
  }

  private checkVersionStatus(): Observable<VersionStatus> {
    Observable.fromPromise(this.wexPlatform.ready(() => this.appVersion.getVersionNumber()))
      .map((versionNumber: string) => ConstantsInfo.Common.VERSION_NUMBER = versionNumber)
      .flatMap((versionNumber: string) => this.getStatus(versionNumber, this.clientId, this.platformName))
      .catch(() => Observable.of(VersionStatus.Supported));
    return Observable.of(VersionStatus.Supported);
  }

  private getStatus(versionNumber: string, clientId: string, platform: string): Observable<VersionStatus> {
    return this.versionStatusProvider
      .checkVersion({ versionNumber, clientId, platform })
      .map(statusResponse => statusResponse.status)
      .publishReplay().refCount();
  }

  public get isSupported(): Observable<boolean> {
    return this.status
      .map(status => (status === VersionStatus.Supported));
  }

  public get isDeprecated(): Observable<boolean> {
    return this.status
      .map(status => (status === VersionStatus.Deprecated));
  }

  public get isUnsupported(): Observable<boolean> {
    return this.status
      .map(status => (status === VersionStatus.Unsupported));
  }

}