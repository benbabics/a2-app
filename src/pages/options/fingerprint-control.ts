import * as _ from "lodash";
import { Fingerprint, UiNotificationsController } from "../../providers/";
import { Session } from "../../models/";
import { Value } from "../../decorators/value";
import { ChangeDetectorRef, Injector } from "@angular/core";
import { Dialogs } from "@ionic-native/dialogs";
import { SecurePage } from "../secure-page";
import { WexAppSnackbarController } from "../../components";
import { AppConstants } from "../../app/app.constants";
import { WexPlatform } from "../../providers/platform";
import { NameUtils } from "../../utils/name-utils";

export abstract class FingerprintController extends SecurePage {

  @Value("BUTTONS") private readonly BUTTONS: any;
  private FINGERPRINT_CONSTANTS = AppConstants().PAGES.OPTIONS.FINGERPRINT_SETTINGS;


  public fingerprintAuthAvailable: boolean = false;
  public fingerprintProfileAvailable: boolean = false;
  protected fingerprint: Fingerprint;
  private dialogs: Dialogs;
  private cdRef: ChangeDetectorRef;
  private wexAppSnackbarController: WexAppSnackbarController;
  private uiNotificationsController: UiNotificationsController;
  public platform: WexPlatform;

  constructor(pageName: string, injector: Injector) {
    super(pageName, injector, [Session.Field.User, Session.Field.ClientSecret]);
    this.fingerprint = injector.get(Fingerprint);
    this.dialogs = injector.get(Dialogs);
    this.cdRef = injector.get(ChangeDetectorRef);
    this.wexAppSnackbarController = injector.get(WexAppSnackbarController);
    this.platform = injector.get(WexPlatform);
    this.uiNotificationsController = injector.get(UiNotificationsController);
  }

  public get enableFingerprintAuthToggle(): boolean {
    return this.fingerprintProfileAvailable;
  }

  public set enableFingerprintAuthToggle(fingerprintProfileAvailable: boolean) {
    // force detection change and initially set true
    // visually remain checked until confirmed in dialog when !fingerprintProfileAvailable
    this.fingerprintProfileAvailable = false;
    this.cdRef.detectChanges();
    this.fingerprintProfileAvailable = true;

    if (fingerprintProfileAvailable) {
      this.createFingerprintProfile()
        .catch(() => this.fingerprintProfileAvailable = false)
        .finally(() => this.cdRef.detectChanges());
    }
    else {
      this.destroyFingerprintProfile()
        .then(hasProfile => this.fingerprintProfileAvailable = hasProfile)
        .finally(() => this.cdRef.detectChanges());
    }
  }

  ionViewWillEnter() {
    if (!this.platform.isMock) {
      this.platform.ready()
        .then(() => this.fingerprint.hasProfile(this.session.user.details.username))
        .then(() => this.fingerprintProfileAvailable = true)
        .catch(() => { });
    }
  }


  private createFingerprintProfile(): Promise<any> {
    return this.uiNotificationsController
      .promptFingerprintTerms()
      .toPromise()
      .then((hasAccepted) => {
        if (hasAccepted) {
          let id = this.session.user.details.username;
          let secret = this.session.clientSecret;

          return this.fingerprint.verify({ id, secret })
            .then(() => this.uiNotificationsController.presentFingerprintProfileSuccessMessage());
        }
      });
  }


  private destroyFingerprintProfile(): Promise<boolean> {
    let id = this.session.user.details.username;

    return this.displayDestroyProfileDialog(id).then((shouldClear: boolean) => {
      if (shouldClear) { this.fingerprint.clearProfile(id); }
      return !shouldClear; // inverse value as "Yes" removes profile, "No" keeps profile
    });
  }


  private displayDestroyProfileDialog(username: string): Promise<boolean> {
    let message = _.template(this.FINGERPRINT_CONSTANTS.destroyFingerprintProfileConfirmMessage)({
      username: NameUtils.MaskUsername(username.toLocaleUpperCase()),
      fingerprintAuthName: this.platform.fingerprintTitle(true)
    });

    return this.dialogs.confirm(message, "", [this.BUTTONS.YES, this.BUTTONS.NO])
      .then((result: number) => Promise.resolve(result === 1));
  }
}
