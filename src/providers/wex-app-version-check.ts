import { Injectable, style } from '@angular/core';
import { Http } from '@angular/http';
import { AppVersion } from "@ionic-native/app-version";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { Value } from '../decorators/value';
import { Platform } from 'ionic-angular';
import { VersionStatus } from "@angular-wex/models";
import { WexPlatform } from './platform';
import { VersionCheckProvider } from "@angular-wex/api-providers";

export namespace RequestPlatform {
    export const Android = "ANDROID";
    export const iOS = "IOS";
    export const Mock = "MOCK";
}

@Injectable()
export class WexAppVerionCheck {
    @Value("AUTH.client_id") clientId: string;
    private _status: Observable<VersionStatus>;
    public get status() {
        return this._status;
    }
    private _versionNumber;
        public get versionNumber() {
        return this._versionNumber;
    }
    private get platformName(): string {
        if (this.wexPlatform.isAndroid()) {
            return RequestPlatform.Android;
        } else if (this.wexPlatform.isIos) {
            return RequestPlatform.iOS;
        } else {
            return RequestPlatform.Mock;
        }
    }

    constructor(
        private http: Http,
        private appVersion: AppVersion,
        private wexPlatform: WexPlatform,
        private versionCheckProvider: VersionCheckProvider
    ) {
        this._status = this.checkVersionStatus();
    }

    private checkVersionStatus(): Observable<VersionStatus> {
        if (this.wexPlatform.isMock) {
            return Observable.of(VersionStatus.Supported);
        } else {
            return Observable.fromPromise(this.appVersion.getVersionNumber())
                .flatMap((versionNumber: string) => {
                    this._versionNumber = versionNumber;
                    return this.getStatus(this.versionNumber, this.clientId, this.platformName);
                });
        }
    }

    private getStatus(versionNumber: string, clientId: string, platform: string): Observable<VersionStatus> {
        return this.versionCheckProvider
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