import * as _ from "lodash";
import { Constants } from "./../../app/app.constants";
import { SecureStorage } from "./../secure-storage";
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Value } from "../../decorators/value";
import {
  IFingerprintVerificationOptions,
  FingerprintPassowrdFallbackMode,
  FingerprintAvailabilityDetails,
  FingerprintProfile,
  FingerprintVerificationError,
  NativeFingerprintService
} from "./native-fingerprint-service";
import { WexPlatform } from "../platform";

export interface AndroidFingerprintVerificationOptions extends IFingerprintVerificationOptions {
  dialogTitle?: string;
  locale?: string;
  maxAttempts?: number;
}

export namespace AndroidFingerprintVerificationOptions {
  export const Defaults: Partial<AndroidFingerprintVerificationOptions> = {
    passwordFallbackMode: FingerprintPassowrdFallbackMode.Default,
    dialogMessage: Constants.FINGERPRINT.defaultDialogMessage
  };
}

type InternalAndroidFingerprintServiceAuthConfig = any; //See https://github.com/mjwheatley/cordova-plugin-android-fingerprint-auth

interface InternalAndroidFingerprintServiceAvailabilityResponse {
  isAvailable: boolean;
  isHardwareDetected: boolean;
  hasEnrolledFingerprints: boolean;
}

interface InternalAndroidFingerprintServiceAuthResponse {
  withFingerprint: boolean;
  withBackup: boolean;
  token: string;
}

interface InternalAndroidFingerprintService {
  ERRORS: any;

  isAvailable(successCallback: (InternalAndroidFingerprintServiceAvailabilityResponse) => void, errorCallback: (any) => void);
  encrypt(options: InternalAndroidFingerprintServiceAuthConfig, successCallback: (InternalAndroidFingerprintServiceAuthResponse) => void, errorCallback: (any) => void);
}

declare var window: {
  FingerprintAuth: InternalAndroidFingerprintService
};

@Injectable()
export class AndroidFingerprintService extends NativeFingerprintService {

  @Value("LOCALE") private static readonly LOCALE: string;
  @Value("STORAGE.ID") private static readonly STORAGE_ID: string;

  private cordovaPlugin: InternalAndroidFingerprintService;

  constructor(secureStorage: SecureStorage, platform: Platform, wexPlatform: WexPlatform) {
    super(secureStorage);

    if (wexPlatform.isAndroid()) {
      platform.ready().then(() => this.cordovaPlugin = window.FingerprintAuth);
    }
  }

  private static get ERRORS(): any {
    return window.FingerprintAuth.ERRORS;
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

  private translateVerificationOptions(options: AndroidFingerprintVerificationOptions): InternalAndroidFingerprintServiceAuthConfig {
    let config: InternalAndroidFingerprintServiceAuthConfig = {
      clientId: AndroidFingerprintService.STORAGE_ID,
      username: options.id,
      disableBackup: options.passwordFallbackMode !== FingerprintPassowrdFallbackMode.Default,
      dialogMessage: options.dialogMessage,
      locale: options.locale || AndroidFingerprintService.LOCALE
    };

    if (options.secret) {
      config.password = options.secret;
    }

    if (options.maxAttempts) {
      config.maxAttempts = options.maxAttempts;
    }

    if (options.dialogTitle) {
      config.dialogTitle = options.dialogTitle;
    }

    return config;
  }

  public isAvailable(): Promise<FingerprintAvailabilityDetails> {
    return this.isPluginReady
      .then(() => this.secureStorage.isAvailable)
      .then(() => new Promise((resolve, reject) => this.cordovaPlugin.isAvailable(resolve, reject)))
      .catch(() => Promise.reject({
        isDeviceSupported: false,
        isSetup: false
      }))
      .then((availabilityDetails: InternalAndroidFingerprintServiceAvailabilityResponse) => {
        if (availabilityDetails.isAvailable) {
          return {
            isDeviceSupported: true,
            isSetup: true
          };
        }

        return Promise.reject({
          isDeviceSupported: availabilityDetails.isHardwareDetected,
          isSetup: availabilityDetails.hasEnrolledFingerprints
        });
      });
  }

  public verify(options: AndroidFingerprintVerificationOptions): Promise<FingerprintProfile|FingerprintVerificationError> {
    options = _.merge({}, AndroidFingerprintVerificationOptions.Defaults, options);

    let isRegistering: boolean = !!options.secret;

    if (!isRegistering) {
      //we're not using the plugin's encryption features, so pass a dummy secret
      options.secret = options.id;
    }

    return this.isAvailable()
      .then(() => new Promise((resolve, reject) => this.cordovaPlugin.encrypt(this.translateVerificationOptions(options), resolve, reject)))
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
          exceededAttempts: error === AndroidFingerprintService.ERRORS.FINGERPRINT_PERMISSION_DENIED,
          userCanceled: error === AndroidFingerprintService.ERRORS.FINGERPRINT_CANCELLED,
          data: error
        });
      });
  }
}
