import { MockFingerprintService } from "./mock-fingerprint-service";
import { WexPlatform } from "../platform";
import { Injectable } from "@angular/core";
import {
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  IFingerprintVerificationOptions,
  INativeFingerprintService,
  FingerprintVerificationError,
} from "./native-fingerprint-service";
import { AndroidFingerprintService } from "./android-fingerprint-service";
import { IosFingerprintService } from "./ios-fingerprint-service";

@Injectable()
export class Fingerprint {

  private readonly _nativeService: INativeFingerprintService;

  constructor(platform: WexPlatform, androidFingerprint: AndroidFingerprintService, iosFingerprint: IosFingerprintService, mockFingerprint: MockFingerprintService) {
    if (platform.isAndroid()) {
      this._nativeService = androidFingerprint;
    }
    else if (platform.isIos()) {
      this._nativeService = iosFingerprint;
    }
    else {
      this._nativeService = mockFingerprint;
    }
  }

  public get nativeService(): INativeFingerprintService {
    return this._nativeService;
  }

  public get isAvailable(): Promise<FingerprintAvailabilityDetails> {
    if (!this._nativeService) {
      return Promise.reject("Fingerprint authentication is not available on this platform.");
    }

    return this.nativeService.isAvailable();
  }

  public clearProfile(id: string): Promise<any> {
    return this.isAvailable.then(() => this.nativeService.clearProfile(id));
  }

  public hasProfile(id: string): Promise<any> {
    return this.isAvailable.then(() => this.nativeService.hasProfile(id));
  }

  public verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    return this.isAvailable.then(() => this.nativeService.verify(options));
  }
}
