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
  isAvailable(): Promise<FingerprintAvailabilityDetails>;
  verify(options: IFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError>;
}
