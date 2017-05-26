import { SecureStorage } from "../secure-storage";

//# FingerprintPassowrdFallbackMode
// --------------------------------------------------

export enum FingerprintPassowrdFallbackMode {
  None, //Android only
  Default,
  Custom //iOS only
}

//# FingerprintVerificationOptions
// --------------------------------------------------

export interface IFingerprintVerificationOptions {
  id: string;
  dialogMessage?: string;
  passwordFallbackMode?: FingerprintPassowrdFallbackMode;
  secret?: string;
}

//# FingerprintAvailabilityDetails
// --------------------------------------------------

export interface FingerprintAvailabilityDetails {
  isDeviceSupported: boolean;
  isSetup: boolean;
}

//# FingerprintProfile
// --------------------------------------------------

export interface FingerprintProfile {
  id: string;
  secret: string;
}

//# FingerprintVerificationError
// --------------------------------------------------

export interface FingerprintVerificationError {
  exceededAttempts: boolean;
  userCanceled: boolean;
  data?: any;
}

//# NativeFingerprintService
// --------------------------------------------------

export interface INativeFingerprintService {
  clearProfile(id: string): Promise<any>;
  hasProfile(id: string): Promise<any>;
  isAvailable(): Promise<FingerprintAvailabilityDetails>;
  verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError>;
}

export abstract class NativeFingerprintService implements INativeFingerprintService {

  abstract isAvailable(): Promise<FingerprintAvailabilityDetails>;
  abstract verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError>;

  constructor(protected secureStorage: SecureStorage) { }

  public clearProfile(id: string): Promise<any> {
    return this.secureStorage.remove(id);
  }

  public hasProfile(id: string): Promise<any> {
    return this.secureStorage.get(id)
      .then((value: any) => {
        if (value) {
          return Promise.resolve(true);
        }
        else {
          return Promise.reject("No profile exists.");
        }
      });
  }
}
