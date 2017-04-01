import { UserCredentials } from './../../models/user-credentials';
import { SessionManager } from './../../providers/session-manager';
import * as _ from "lodash";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, NavParams, Platform, Content } from "ionic-angular";
import { LandingPage } from "../landing/landing";
import { Page } from "../page";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage extends Page {
  @ViewChild("content") content: Content;
  @ViewChild("keyboardSpacer") keyboardSpacer: ElementRef;

  public fingerprintAuthAvailable: boolean = false;
  public fingerprintProfileAvailable: boolean = false;
  public isLoggingIn: boolean = false;
  public setupFingerprintAuth: boolean = false;
  public rememberMe: boolean = false;
  public timedOut: boolean = false;
  public usernameIsFocused: boolean = false;
  public user: UserCredentials = { username: "", password: "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private sessionManager: SessionManager) {
    super("Login");
  }

  public get fingerprintDisabledLabel(): string {
    return this.resolvePlatformConstant(this.CONSTANTS.touchId.disabled.label);
  }

  public get maskableUsername(): string {
    if (this.usernameIsFocused) {
      return this.user.username;
    }
    else {
      return this.user.username.replace(/.{1,3}$/, "***").substr(0, this.user.username.length);
    }
  }

  public set maskableUsername(username: string) {
    this.user.username = username;
  }

  ionViewWillEnter() {
    window.addEventListener("native.keyboardshow", (event) => this.onKeyboardOpen(event));
    window.addEventListener("native.keyboardhide", (event) => this.onKeyboardClose(event));
  }

  ionViewDidEnter() {

  }

  private clearFingerprintProfile(username: string): Promise<void> {
    this.fingerprintProfileAvailable = false;

    //return FingerprintProfileUtil.clearProfile(username);
    return Promise.resolve();
  }

  private clearForm() {
    this.rememberMe = false;
    this.user.username = "";
    this.user.password = "";

    this.rememberUsername(false);
  }

  private onKeyboardOpen(event: any) {
    //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
    //see http://ionicframework.com/docs/api/page/keyboard/
    this.content.getNativeElement().classList.add("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = `${event.keyboardHeight}px`;
  }

  private onKeyboardClose(event: any) {
    this.content.getNativeElement().classList.remove("keyboard-open");
    this.keyboardSpacer.nativeElement.style.height = "0px";
  }

  private resolvePlatformConstant(constant: any): string {
    let platforms: string[] = this.platform.platforms();

    if (_.includes(platforms, "android")) {
      return _.get(constant, "android", "default");
    }

    if (_.includes(platforms, "ios")) {
      return _.get(constant, "ios", "default");
    }

    return constant ? constant.default : undefined;
  }

  private rememberUsername(shouldRemember: boolean, username?: string) {
    /*if (shouldRemember) {
      $localStorage[USERNAME_KEY] = username;
    }
    else {
      delete $localStorage[USERNAME_KEY];
    }*/
  }

  public logIn(event: Event, setupFingerprintAuth?: boolean) {
    this.isLoggingIn = true;

    this.sessionManager.initSession(this.user)
      .finally(() => this.isLoggingIn = false)
      .subscribe(null, null, () => {
        this.navCtrl.push(LandingPage);
      });

    event.preventDefault();
  }

  public verifyFingerprintRemoval(): Promise<void> {
    if (this.fingerprintProfileAvailable) {
      /*return $cordovaDialogs.confirm(
        this.resolvePlatformConstant(this.CONSTANTS.touchId.warningPrompt.message),
        this.CONSTANTS.touchId.warningPrompt.title, [
          this.CONSTANTS.touchId.warningPrompt.buttons.ok,
          this.CONSTANTS.touchId.warningPrompt.buttons.cancel
        ])
        .then((result: number) => {
          if (result === 1) {
            this.clearFingerprintProfile(this.user.username);
            this.clearForm();
          }
        });*/
    }
    else {
      return Promise.resolve();
    }
  }
}
