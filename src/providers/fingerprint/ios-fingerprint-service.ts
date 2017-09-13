import * as _ from "lodash";
import { AppConstants } from "./../../app/app.constants";
import { SecureStorage } from "./../secure-storage";
import { Injectable } from "@angular/core";
import {
  IFingerprintVerificationOptions,
  FingerprintPassowrdFallbackMode,
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  FingerprintVerificationError,
  NativeFingerprintService
} from "./native-fingerprint-service";

const Constants = AppConstants();

export interface IosFingerprintVerificationOptions extends IFingerprintVerificationOptions {
  dialogPasswordLabel?: string;
}

export namespace IosFingerprintVerificationOptions {
  export const Defaults: Partial<IosFingerprintVerificationOptions> = {
    passwordFallbackMode: FingerprintPassowrdFallbackMode.Default,
    dialogMessage: Constants.AUTH.BIOMETRIC.FINGERPRINT.defaultDialogMessage
  };
}

interface InternalIosFingerprintService {
  isAvailable(successCallback: (InternalAndroidFingerprintServiceAvailabilityResponse) => void, errorCallback: (x: any) => void);
  verifyFingerprint(message: string, successCallback: (InternalAndroidFingerprintServiceAuthResponse) => void, errorCallback: (x: any) => void);
  verifyFingerprintWithCustomPasswordFallback(message: string, successCallback: (InternalAndroidFingerprintServiceAuthResponse) => void, errorCallback: (x: any) => void);
  verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message: string, passwordLabel: string, successCallback: (InternalAndroidFingerprintServiceAuthResponse) => void, errorCallback: (x: any) => void);
}

declare var window: {
  cordova,
  plugins: {
    touchid: InternalIosFingerprintService
  }
};

@Injectable()
export class IosFingerprintService extends NativeFingerprintService {

  private static readonly IOS_EXCEEDED_ATTEMPTS = -1;
  private static readonly IOS_PASSCODE_NOT_SET = -5;
  private static readonly IOS_TOUCH_ID_NOT_AVAILABLE = -6;
  private static readonly IOS_TOUCH_ID_NOT_ENROLLED = -7;
  private static readonly IOS_USER_CANCELED = -128;
  private static readonly IOS_SEC_AUTH_FAILED = -25293;

  private cordovaPlugin: InternalIosFingerprintService;

  constructor(secureStorage: SecureStorage) {
    super(secureStorage);

    if (_.has(window, "plugins.touchid")) {
      this.cordovaPlugin = window.plugins.touchid;
    }
    else {
      throw new Error("iOS touchid plugin is not available.");
    }
  }

  private get isPluginReady(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cordovaPlugin) {
        resolve(this.cordovaPlugin);
      }
      else {
        console.info("Fingerprint authentication service is not available yet (missing platform.ready()?)");
        reject("Fingerprint authentication service is not available.");
      }
    });
  }

  public isAvailable(): Promise<FingerprintAvailabilityDetails> {
    return this.isPluginReady
      .then(() => this.secureStorage.isAvailable)
      .then(() => new Promise((resolve, reject) => this.cordovaPlugin.isAvailable(resolve, reject)))
      .then((): FingerprintAvailabilityDetails => {
        return {
          isDeviceSupported: true,
          isSetup: true
        };
      })
      .catch((availabilityDetails): Promise<FingerprintAvailabilityDetails> => {
        let options: FingerprintAvailabilityDetails = {
          isDeviceSupported: false,
          isSetup: false
        };

        if (_.has(availabilityDetails, "code")) {
          options.isDeviceSupported = !_.includes([
            IosFingerprintService.IOS_TOUCH_ID_NOT_AVAILABLE
          ], availabilityDetails.code);

          options.isSetup = options.isDeviceSupported && !_.includes([
            IosFingerprintService.IOS_PASSCODE_NOT_SET,
            IosFingerprintService.IOS_TOUCH_ID_NOT_ENROLLED
          ], availabilityDetails.code);
        }

        return Promise.reject(options);
      });
  }

  public verify(options: IosFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    options = _.merge({}, IosFingerprintVerificationOptions.Defaults, options);

    let pluginCommand: (resolve, reject) => void;
    let isRegistering: boolean = !!options.secret;

    if (options.passwordFallbackMode === FingerprintPassowrdFallbackMode.Custom) {
      if (options.dialogPasswordLabel) {
        pluginCommand = _.partial(this.cordovaPlugin.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel, options.dialogMessage, options.dialogPasswordLabel, _, _);
      }
      else {
        pluginCommand = _.partial(this.cordovaPlugin.verifyFingerprintWithCustomPasswordFallback, options.dialogMessage, _, _);
      }
    }
    else {
      pluginCommand = _.partial(this.cordovaPlugin.verifyFingerprint, options.dialogMessage, _, _);
    }

    return this.isAvailable()
      .then(() => new Promise((resolve, reject) => pluginCommand(resolve, reject)))
      .then((): Promise<string> => {
        if (isRegistering) {
          return this.secureStorage.set(options.id, options.secret).then(() => options.secret);
        }
        else {
          return this.secureStorage.get<string>(options.id);
        }
      })
      .then((secret: string): FingerprintProfile => ({ id: options.id, secret: secret }))
      .catch((error): Promise<FingerprintVerificationError> => {
        return Promise.reject({
          exceededAttempts: _.includes([
            IosFingerprintService.IOS_EXCEEDED_ATTEMPTS
          ], error.code),
          userCanceled: _.includes([
            IosFingerprintService.IOS_USER_CANCELED,
            IosFingerprintService.IOS_SEC_AUTH_FAILED
          ], error.code),
          data: error
        });
      });
  }
}
