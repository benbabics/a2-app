import { Injectable } from "@angular/core";
import {
  INativeFingerprintService,
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  FingerprintVerificationError
} from "./native-fingerprint-service";

@Injectable()
export class MockFingerprintService implements INativeFingerprintService {

  public clearProfile(): Promise<any> {
    return Promise.reject("Mock fingerprint service has no profiles.");
  }

  public hasProfile(): Promise<any> {
    return Promise.reject("Mock fingerprint service has no profiles.");
  }

  public isAvailable(): Promise<FingerprintAvailabilityDetails> {
    return Promise.reject({
      isDeviceSupported: false,
      isSetup: false
    });
  }

  public verify(): Promise<FingerprintProfile|FingerprintVerificationError> {
    return Promise.reject({
      exceededAttempts: false,
      userCanceled: false,
      data: "Mock fingerprint service does not support fingerprint verification."
    });
  }
}
