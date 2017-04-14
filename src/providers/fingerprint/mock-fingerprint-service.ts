import { Injectable } from "@angular/core";
import {
  IFingerprintVerificationOptions,
  INativeFingerprintService,
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  FingerprintVerificationError
} from "./native-fingerprint-service";

@Injectable()
export class MockFingerprintService implements INativeFingerprintService {

  public clearProfile(id: string): Promise<any> {
    return Promise.reject("Mock fingerprint service has no profiles.")
  }

  public hasProfile(id: string): Promise<any> {
    return Promise.reject("Mock fingerprint service has no profiles.");
  }

  public isAvailable(): Promise<FingerprintAvailabilityDetails> {
    return Promise.reject({
      isDeviceSupported: false,
      isSetup: false
    });
  }

  public verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    return Promise.reject({
      exceededAttempts: false,
      userCanceled: false,
      data: "Mock fingerprint service does not support fingerprint verification."
    });
  }
}
