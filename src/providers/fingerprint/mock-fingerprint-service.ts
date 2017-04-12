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

  public isAvailable(): Promise<FingerprintAvailabilityDetails> {
    return Promise.resolve({
      isDeviceSupported: true,
      isSetup: true
    });
  }

  public verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    return Promise.resolve({
      id: options.id,
      secret: options.secret
    });
  }
}
