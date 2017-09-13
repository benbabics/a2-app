import { MockFingerprintService } from "./mock-fingerprint-service";
import { WexPlatform } from "../platform";
import { Injectable, Injector } from "@angular/core";
import {
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  IFingerprintVerificationOptions,
  INativeFingerprintService,
  FingerprintVerificationError,
} from "./native-fingerprint-service";
import { AndroidFingerprintService } from "./android-fingerprint-service";
import { IosFingerprintService } from "./ios-fingerprint-service";
import { LocalStorageService } from "angular-2-local-storage/dist";

@Injectable()
export class Fingerprint {
  public static readonly hasShownFingerprintSetupMessageKey = "hasShownFingerprintSetupMessage";

  private _nativeService: INativeFingerprintService;

  constructor(private localStorageService: LocalStorageService, platform: WexPlatform, injector: Injector) {
    platform.ready(() => {
      let nativeServiceType;

      if (platform.isAndroid) {
        nativeServiceType = AndroidFingerprintService;
      }
      else if (platform.isIos) {
        nativeServiceType = IosFingerprintService;
      }
      else {
        nativeServiceType = MockFingerprintService;
      }

      try {
        this._nativeService = injector.get<INativeFingerprintService>(nativeServiceType);
      }
      catch (error) {
        console.info("Native fingerprint service is not available. Falling back to mock fingerprint service implementation.");

        this._nativeService = injector.get<MockFingerprintService>(MockFingerprintService);
      }
    });
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
    return this.isAvailable.then(() => this.nativeService.clearProfile(this.getId(id)));
  }

  public hasProfile(id: string): Promise<any> {
    return this.isAvailable.then(() => this.nativeService.hasProfile(this.getId(id)));
  }

  public verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    if (!!options.secret) {
      this.localStorageService.set(Fingerprint.hasShownFingerprintSetupMessageKey, false);
    }
    options.id = this.getId(options.id);
    return this.isAvailable.then(() => this.nativeService.verify(options));
  }

  private getId(username: string) {
    return username.toLowerCase().trim();
  }
}
