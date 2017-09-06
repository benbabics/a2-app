import { WexNavBar, WexAppSnackbarController } from "../../components";
import { Session } from "../../models";
import * as _ from "lodash";
import { Component, ViewChild, ElementRef, Injector } from "@angular/core";
import { NavParams, Platform, Content, NavController, ModalController } from "ionic-angular";
import { Page } from "../page";
import {
  SessionManager,
  SessionAuthenticationMethod,
  Fingerprint
} from "../../providers";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { Value } from "../../decorators/value";
import { Dialogs } from "@ionic-native/dialogs";
import { Keyboard } from "@ionic-native/keyboard";
import { Response } from "@angular/http";
import { UserCredentials } from "@angular-wex/models";
import { FingerprintVerificationError } from "../../providers/fingerprint/native-fingerprint-service";
import { WexAppVersionCheck } from "../../providers/wex-app-version-check";
import { VersionCheck } from "./version-check/version-check";
import { NameUtils } from "../../utils/name-utils";

export type LoginPageNavParams = keyof {
  fromLogOut,
  fromTimeout
};

export namespace LoginPageNavParams {
  export const fromLogOut: LoginPageNavParams = "fromLogOut";
  export const fromTimeout: LoginPageNavParams = "fromTimeout";
}

export namespace LoginError {
  export const PASSWORD_CHANGED = "PASSWORD_CHANGED";
  export const UNAUTHORIZED = "unauthorized";
}

declare const cordova: any;

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage extends Page {
  @ViewChild("content") content: Content;
  @ViewChild("keyboardSpacer") keyboardSpacer: ElementRef;

  @Value("STORAGE.KEYS.USERNAME") private readonly USERNAME_KEY: string;

  private _onKeyboardOpen = event => this.onKeyboardOpen(event);
  private _onKeyboardClose = () => this.onKeyboardClose();

  public fingerprintAuthAvailable: boolean = false;
  public fingerprintProfileAvailable: boolean = false;
  public isLoggingIn: boolean = false;
  public setupFingerprintAuth: boolean = false;
  public rememberMe: boolean = false;
  public timedOut: boolean = false;
  public usernameIsFocused: boolean = false;
  public versionCheckComplete: boolean = false;
  public user: UserCredentials = { username: "", password: "" };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private sessionManager: SessionManager,
    private fingerprint: Fingerprint,
    private localStorageService: LocalStorageService,
    private dialogs: Dialogs,
    private keyboard: Keyboard,
    private appSnackbarController: WexAppSnackbarController,
    private wexAppVersionCheck: WexAppVersionCheck,
    private modalController: ModalController,
    injector: Injector
  ) {
    super("Login", injector);
  }

  public get fingerprintDisabledLabel(): string {
    return this.resolvePlatformConstant(this.CONSTANTS.touchId.disabled.label);
  }

  public get maskableUsername(): string {
    if (this.usernameIsFocused) {
      return this.user.username;
    }
    else {
      return NameUtils.MaskUsername(this.user.username);
    }
  }

  public set maskableUsername(username: string) {
    this.user.username = username;
  }

  public get rememberMeToggle(): boolean {
    return this.rememberMe;
  }

  public set rememberMeToggle(rememberMe: boolean) {
    if (!rememberMe && this.fingerprintProfileAvailable) {
      this.verifyFingerprintRemoval();
    }
    else {
      this.rememberMe = rememberMe;
    }
  }

  public get setupFingerprintAuthToggle(): boolean {
    return this.setupFingerprintAuth;
  }

  public set setupFingerprintAuthToggle(setupFingerprintAuth: boolean) {
    if (setupFingerprintAuth) {
      //automatically enable remember me
      this.rememberMe = true;
    }

    this.setupFingerprintAuth = setupFingerprintAuth;
  }

  private clearFingerprintProfile(username: string): Promise<void> {
    this.fingerprintProfileAvailable = false;

    return this.fingerprint.clearProfile(username.toLowerCase());
  }

  private clearForm() {
    this.rememberMe = false;
    this.user.username = "";
    this.user.password = "";

    this.rememberUsername(false);
  }

  private doFingerprintAuthCheck() {
    //enable fingerprint login if there is an existing fingerprint profile for this user
    return this.platform.ready()
      .then(() => this.fingerprint.isAvailable)
      .then(() => this.fingerprintAuthAvailable = true)
      .then(() => this.fingerprint.hasProfile(this.user.username.toLowerCase()))
      .then(() => this.fingerprintProfileAvailable = true);
  }

  private onKeyboardOpen(event: any) {
    //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
    //see http://ionicframework.com/docs/api/page/keyboard/
    this.content.getNativeElement().classList.add("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = `${event.keyboardHeight}px`;
  }

  private onKeyboardClose() {
    this.content.getNativeElement().classList.remove("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = "0px";
  }

  private login(setupFingerprintAuth?: boolean) {
    if (!this.isLoggingIn) {
      let authenticationMethod = setupFingerprintAuth ? SessionAuthenticationMethod.Fingerprint : SessionAuthenticationMethod.Secret;

      this.isLoggingIn = true;
      this.user.username = this.user.username.toLowerCase().trim();

      this.sessionManager.initSession(this.user, { authenticationMethod })
        .flatMap(() => this.sessionManager.cache.getSessionDetail(Session.Field.User)) //Pre-fetch the user object for the landing page
        .finally(() => this.isLoggingIn = false)
        .subscribe(() => {
          this.rememberUsername(this.rememberMe, this.user.username);

          //Transition to the main app
          this.navCtrl.setRoot(WexNavBar);
        }, (error: Response) => {
          let errorCode: string = error instanceof Response ? error.json().error_description : error;

          let fingerprintVerificationError: FingerprintVerificationError = error instanceof Response ? error.json().error : error;
          console.error(fingerprintVerificationError);

           if (this.fingerprintProfileAvailable && errorCode === LoginError.UNAUTHORIZED) {
            errorCode = LoginError.PASSWORD_CHANGED;

            let id = this.user.username.toLowerCase();
            this.fingerprint.clearProfile(id);
            this.fingerprintProfileAvailable = false;
          }

          if (!fingerprintVerificationError.userCanceled) {
            this.appSnackbarController.createQueued({
              message: this.getLoginErrorDisplayText(errorCode),
              cssClass: "red",
              showCloseButton: true
            }).present();
          }
        });
    }
  }

  private getLoginErrorDisplayText(errorCode: string): string {
    return _.get(this.CONSTANTS.serverErrors, errorCode, this.CONSTANTS.serverErrors.DEFAULT);
  }

  private rememberUsername(shouldRemember: boolean, username?: string) {
    if (shouldRemember) {
      this.localStorageService.set(this.USERNAME_KEY, username);
    }
    else {
      this.localStorageService.remove(this.USERNAME_KEY);
    }
  }

  private showUserSettingsPopup(): Promise<any> {
    return this.dialogs.confirm(
      this.resolvePlatformConstant(this.CONSTANTS.touchId.settingsPrompt.message),
      this.CONSTANTS.touchId.settingsPrompt.title, [
        this.CONSTANTS.touchId.settingsPrompt.buttons.settings,
        this.CONSTANTS.touchId.settingsPrompt.buttons.cancel
      ])
      .then((result: number) => {
        if (result === 1) {
          switch (this.CONSTANTS.PLATFORM.CURRENT) {
            case this.CONSTANTS.PLATFORM.ANDROID:
              cordova.plugins.settings.openSetting("security");
              break;
            default:
              cordova.plugins.settings.open();
              break;
          }
        }
      });
  }

  private unlockForm() {
    this.versionCheckComplete = true;
  }

  private presentVersionModal() {
    this.wexAppVersionCheck.status
      .subscribe(status => {
        let versionCheckModal = this.modalController.create(VersionCheck, { status });
        versionCheckModal.onDidDismiss(() => this.completeLoading());
        versionCheckModal.present();
      });
  }

  private completeLoading() {

    this.unlockForm();

    this.keyboard.disableScroll(true);

    window.addEventListener("native.keyboardshow", this._onKeyboardOpen);
    window.addEventListener("native.keyboardhide", this._onKeyboardClose);

    // Check to see if the user timed out
    if (this.navParams.get(LoginPageNavParams.fromTimeout)) {
      this.appSnackbarController.createQueued({ message: this.CONSTANTS.sessionTimeOut }).present();
    }

    // Check the status of remember me
    if (this.localStorageService.get(this.USERNAME_KEY)) {
      this.user.username = this.localStorageService.get<string>(this.USERNAME_KEY);
      this.rememberMe = true;
    }

    // Check the status of fingerprint authentication
    this.doFingerprintAuthCheck()
      .then(() => {
        if (this.fingerprintProfileAvailable && !this.navParams.get(LoginPageNavParams.fromLogOut)) {
          //show the fingerprint prompt
          this.login(true);
        }
      })
      .catch((error) => {
        if (_.get(error, "isDeviceSupported")) {
          this.clearFingerprintProfile(this.user.username);

          this.showUserSettingsPopup().finally(() => this.doFingerprintAuthCheck());
        }
      });
  }

  ionViewDidEnter() {
    this.wexAppVersionCheck.isSupported
      .subscribe(isSupported => {
        if (isSupported) {
          this.completeLoading();
        } else {
          this.presentVersionModal();
        }
      });
  }

  ionViewDidLeave() {
    this.keyboard.disableScroll(false);

    window.removeEventListener("native.keyboardshow", this._onKeyboardOpen);
    window.removeEventListener("native.keyboardhide", this._onKeyboardClose);
  }

  public onLogin(event: Event, setupFingerprintAuth?: boolean) {
    this.login(setupFingerprintAuth);

    event.preventDefault();
  }

  public verifyFingerprintRemoval(): Promise<void> {
    if (this.fingerprintProfileAvailable) {
      return this.dialogs.confirm(
        this.resolvePlatformConstant(this.CONSTANTS.touchId.warningPrompt.message),
        this.CONSTANTS.touchId.warningPrompt.title, [
          this.CONSTANTS.touchId.warningPrompt.buttons.ok,
          this.CONSTANTS.touchId.warningPrompt.buttons.cancel
        ]).then((result: number) => {
          if (result === 1) {
            this.clearFingerprintProfile(this.user.username);
            this.clearForm();
          }
        });
    }
    else {
      return Promise.resolve();
    }
  }
}
