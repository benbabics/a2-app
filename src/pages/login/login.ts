import { WexNavBar, WexAppSnackbarController } from "../../components";
import { Session } from "../../models";
import * as _ from "lodash";
import { Component, ViewChild, ElementRef, Injector, Renderer2 } from "@angular/core";
import { NavParams, Content, NavController, ModalController } from "ionic-angular";
import { Page } from "../page";
import { SessionManager, Fingerprint, AuthenticationMethod } from "../../providers";
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
import { WexPlatform } from "../../providers/platform";
import { StatusBarStyle, PageTheme } from "../../decorators/status-bar";

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
  export const UNKNOWN_CAUSE = "UNKNOWN_CAUSE";
}

export type LoginAnalyticsEvent = keyof {
  errorInactive
  errorAccountNotReady,
  errorWrongCredentials,
  errorPasswordLocked,
  loginManual,
  loginBiometric,
};

export namespace LoginAnalyticsEvent {

  export const ErrorInactive: LoginAnalyticsEvent = "errorInactive";
  export const ErrorAccountNotReady: LoginAnalyticsEvent = "errorAccountNotReady";
  export const ErrorWrongCredentials: LoginAnalyticsEvent = "errorWrongCredentials";
  export const ErrorPasswordLocked: LoginAnalyticsEvent = "errorPasswordLocked";
  export const LoginManual: LoginAnalyticsEvent = "loginManual";
  export const LoginBiometric: LoginAnalyticsEvent = "loginBiometric";
}

declare const cordova: any;

@StatusBarStyle(PageTheme.Dark)
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage extends Page {
  @ViewChild("content") content: Content;
  @ViewChild("keyboardSpacer") keyboardSpacer: ElementRef;
  @ViewChild("titleHeadingBar") titleHeadingBar: ElementRef;

  @Value("STORAGE.KEYS.USERNAME") private readonly USERNAME_KEY: string;

  private _onKeyboardOpen = event => this.onKeyboardOpen(event);
  private _onKeyboardClose = () => this.onKeyboardClose();

  // Only server errors explicitly listed in this map will be tracked in analytics.
  private readonly loginErrorAnalyticsEventMap: { [serverError: string]: string } = {
    USER_NOT_ACTIVE: "errorInactive",
    AUTHORIZATION_FAILED: "errorAccountNotReady",
    USER_LOCKED: "errorPasswordLocked",
    UNKNOWN_CAUSE: "errorWrongCredentials"
  };
  private resumeSubscription: any;

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
    private platform: WexPlatform,
    private sessionManager: SessionManager,
    private fingerprint: Fingerprint,
    private localStorageService: LocalStorageService,
    private dialogs: Dialogs,
    private keyboard: Keyboard,
    private appSnackbarController: WexAppSnackbarController,
    private wexAppVersionCheck: WexAppVersionCheck,
    private modalController: ModalController,
    private renderer: Renderer2,
    injector: Injector
  ) {
    super("Login", injector);
  }

  public get fingerprintDisabledLabel(): string {
    return this.platform.constant(this.CONSTANTS.touchId.disabled.label);
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

  // Originally used get/set ngModel on this method and this.rememberMe
  // However, blocked set would not keep view accurate to model
  public rememberMeToggle() {
    if (!this.rememberMe && this.fingerprintProfileAvailable) {
      this.verifyFingerprintRemoval();
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
    return this.fingerprint.isAvailable
      .then(() => this.fingerprintAuthAvailable = true)
      .then(() => this.fingerprint.hasProfile(this.user.username))
      .then(() => this.fingerprintProfileAvailable = true);
  }

  private onKeyboardOpen(event: any) {
    //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
    //see http://ionicframework.com/docs/api/page/keyboard/
    this.content.getNativeElement().classList.add("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = `${event.keyboardHeight + 65}px`;
    this.renderer.addClass(this.titleHeadingBar.nativeElement, "fadeout");
    this.renderer.removeClass(this.titleHeadingBar.nativeElement, "fadein");
  }

  private onKeyboardClose() {
    this.content.getNativeElement().classList.remove("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = "0px";
    this.renderer.addClass(this.titleHeadingBar.nativeElement, "fadein");
    this.renderer.removeClass(this.titleHeadingBar.nativeElement, "fadeout");
  }

  private login(useFingerprintAuth?: boolean) {
    if (!this.isLoggingIn) {
      let authenticationMethod = useFingerprintAuth ? AuthenticationMethod.Fingerprint : AuthenticationMethod.Secret;

      this.isLoggingIn = true;
      this.user.username = this.user.username.toLowerCase().trim();

      this.sessionManager.initSession(this.user, { authenticationMethod })
        .flatMap(() => this.sessionManager.cache.update$(Session.Field.User)) //Pre-fetch the user object for the landing page
        .finally(() => this.isLoggingIn = false)
        .subscribe(() => {
          this.rememberUsername(this.rememberMe, this.user.username);

          if (useFingerprintAuth) {
            this.trackAnalyticsEvent("loginBiometric");
          }
          else {
            this.trackAnalyticsEvent("loginManual");
          }

          //Transition to the main app
          this.navCtrl.setRoot(WexNavBar, { }, { animate: true, direction: "forward" });
        }, (error: Response) => {
          let errorCode: string = error instanceof Response ? error.json().error_description : error;
          let fingerprintVerificationError: FingerprintVerificationError = error instanceof Response ? error.json().error : error;

          console.error(fingerprintVerificationError);

          /* NOTE: This is disabled until we fix the SmartHub authentication issue.
          // Clear the user's fingerprint profile if their password changed online
          if (this.fingerprintProfileAvailable && errorCode === LoginError.UNKNOWN_CAUSE) {
            errorCode = LoginError.PASSWORD_CHANGED;

            this.fingerprint.clearProfile(this.user.username);
            this.fingerprintProfileAvailable = false;
          }*/

          if (!fingerprintVerificationError.userCanceled && !fingerprintVerificationError.exceededAttempts) {
            this.appSnackbarController.createQueued({
              message: this.getLoginErrorDisplayText(errorCode),
              showCloseButton: true,
              cssClass: "red"
            }).present();

            // Check to see if this error maps to a trackable analytics error
            let analyticsEvent = this.loginErrorAnalyticsEventMap[errorCode];

            if (analyticsEvent) {
              let additionalParams = [];

              if (analyticsEvent === LoginAnalyticsEvent.ErrorWrongCredentials) {
                // Add the appropriate label for the event
                additionalParams.push(useFingerprintAuth ? "Biometric" : "Manual");
              }

              this.trackAnalyticsEvent(analyticsEvent, ...additionalParams);
            }
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
      this.platform.constant(this.CONSTANTS.touchId.settingsPrompt.message),
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
        versionCheckModal.onDidDismiss(() => {
          try {
            // Fixes StatusBarStyle
            (this as any).ionViewWillEnter();
          } catch (e) { }
          this.completeLoading();
        });
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
        if (this.fingerprintProfileAvailable && !this.navParams.get(LoginPageNavParams.fromLogOut) && !this.navParams.get(LoginPageNavParams.fromTimeout)) {
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

    // Show the fingerprint prompt on resume if fingerprint enabled
    // NOTE: We need to set a timeout or the fingerprint plugin will get invalid finerprint errors
    this.resumeSubscription = this.platform.resume.subscribe(() => setTimeout(() => {
      if (this.fingerprintProfileAvailable) {
        this.login(true);
      }
    }, 500));
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

    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
  }

  public onLogin(event: Event, useFingerprintAuth?: boolean) {
    this.login(useFingerprintAuth);

    event.preventDefault();
  }

  public verifyFingerprintRemoval(): Promise<void> {
    if (this.fingerprintProfileAvailable) {
      return this.dialogs.confirm(
        this.platform.constant(this.CONSTANTS.touchId.warningPrompt.message),
        this.CONSTANTS.touchId.warningPrompt.title, [
          this.CONSTANTS.touchId.warningPrompt.buttons.ok,
          this.CONSTANTS.touchId.warningPrompt.buttons.cancel
        ]).then((result: number) => {
          if (result === 1) {
            this.clearFingerprintProfile(this.user.username);
            this.clearForm();
          } else {
            this.rememberMe = true;
          }
        });
    }
    else {
      return Promise.resolve();
    }
  }
}
