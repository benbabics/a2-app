import { WexPlatform } from "./platform";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Value } from "../decorators/value";

type SuccessCallback = (value) => void;
type ErrorCallback = (error) => void;

interface ISecureStorage {
  get(successCallback: SuccessCallback, errorCallback: ErrorCallback, key: string);
  remove(successCallback: SuccessCallback, errorCallback: ErrorCallback, key: string);
  set(successCallback: SuccessCallback, errorCallback: ErrorCallback, key: string, value: any);
}

declare var cordova: {
  plugins: {
    SecureStorage: { new(successCallback: () => void, errorCallback: (any) => void, storageKey: string): ISecureStorage }
  }
};

@Injectable()
export class SecureStorage {

  @Value("STORAGE.ID") private static readonly STORAGE_ID: string;

  private secureStorage: ISecureStorage;
  private available: Promise<any>;

  constructor(platform: WexPlatform) {
    this.available = new Promise((resolve, reject) => {
        platform.ready(() => {
          if (_.has(window, "cordova.plugins.SecureStorage")) {
            this.secureStorage = new cordova.plugins.SecureStorage(resolve, reject, SecureStorage.STORAGE_ID);
          }
          else {
            if (platform.isMock) {
              console.info("Secure storage is not available on this platform. Using mock implementation");
              this.secureStorage = this.browserMock();
              resolve();
            }
            else {
              return Promise.reject("Secure storage is not available on this platform.");
            }
          }
        });
    });
  }

  private browserMock(): ISecureStorage {
    return {
      get: (successCallback: SuccessCallback, /*errorCallback: ErrorCallback, key: string*/) => {
        console.error("TODO");
        successCallback(null); //TODO
      },

      remove: (successCallback: SuccessCallback, /*errorCallback: ErrorCallback, key: string*/) => {
        console.error("TODO");
        successCallback(null); //TODO
      },

      set: (successCallback: SuccessCallback, /*errorCallback: ErrorCallback, key: string, value: any*/) => {
        console.error("TODO");
        successCallback(null); //TODO
      }
    };
  }

  public get isAvailable(): Promise<boolean> {
    return this.available;
  }

  public get<T>(key: string): Promise<T> {
    return this.isAvailable.then(() => new Promise<T>((resolve, reject) => this.secureStorage.get(resolve, reject, key)));
  }

  public remove(key: string): Promise<any> {
    return this.isAvailable.then(() => new Promise((resolve, reject) => this.secureStorage.remove(resolve, reject, key)));
  }

  public set(key: string, value: any): Promise<any> {
    return this.isAvailable.then(() => new Promise((resolve, reject) => this.secureStorage.set(resolve, reject, key, value)));
  }
}
