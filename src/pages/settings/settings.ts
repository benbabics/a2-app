import * as _ from "lodash";
import { Platform } from "ionic-angular";
import { Fingerprint } from "../../providers/";
import { Session } from "../../models/";
import { Value } from "../../decorators/value";
import { Component, ChangeDetectorRef, Injector } from "@angular/core";
import { Dialogs } from "@ionic-native/dialogs";
import { SecurePage } from "../secure-page";
import { WexAppSnackbarController } from "../../components";

@Component({
  selector:    "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage extends SecurePage {

  @Value("BUTTONS") private readonly BUTTONS: any;

  public fingerprintAuthAvailable: boolean = false;
  public fingerprintProfileAvailable: boolean = false;
  public platformFingerprintLabel: string = this.resolvePlatformConstant( this.CONSTANTS.fingerprintAuthName );

  constructor(
    private fingerprint: Fingerprint,
    private platform: Platform,
    private dialogs: Dialogs,
    private cdRef: ChangeDetectorRef,
    private wexAppSnackbarController: WexAppSnackbarController,
    injector: Injector
  ) {
    super( "Settings", injector, [ Session.Field.User, Session.Field.ClientSecret ] );
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

    if ( fingerprintProfileAvailable ) {
      this.createFingerprintProfile()
        .catch(() => this.fingerprintProfileAvailable = false )
        .finally(() => this.cdRef.detectChanges() );
    }
    else {
      this.destroyFingerprintProfile()
        .then( hasProfile => this.fingerprintProfileAvailable = hasProfile )
        .finally(() => this.cdRef.detectChanges() );
    }
  }

  ionViewWillEnter() {
    // enable fingerprint login if there is an existing fingerprint profile for this user
    this.platform.ready()
      .then(() => this.fingerprint.hasProfile( this.session.user.details.username.toLowerCase() ))
      .then(() => this.fingerprintProfileAvailable = true )
      .catch(() => {});
  }


  private createFingerprintProfile(): Promise<any> {
    let id = this.session.user.details.username.toLowerCase(),
        secret = this.session.clientSecret;

    return new Promise((resolve, reject) => {
      this.sessionManager.promptFingerprintTerms().subscribe(hasAccepted => {
        if ( hasAccepted ) {
          this.fingerprint.verify({ id, secret })
            .then(() => {
              resolve();
              this.displayProfileCreatedMessage( id );
            })
            .catch(() => reject());
        }

        else reject();
      });
    });
  }


  private destroyFingerprintProfile(): Promise<boolean> {
    let id = this.session.user.details.username.toLowerCase();

    return this.displayDestroyProfileDialog( id ).then((shouldClear: boolean) => {
      if ( shouldClear ) { this.fingerprint.clearProfile( id ); }
      return !shouldClear; // inverse value as "Yes" removes profile, "No" keeps profile
    });
  }


  private displayProfileCreatedMessage(username: string): void {
    let fingerprintProfileCreatedMessage = _.template(this.CONSTANTS.createFingerprintProfileMessage)({
      username,
      fingerprintAuthName: this.platformFingerprintLabel
    });

    this.wexAppSnackbarController.createQueued({
      message:  fingerprintProfileCreatedMessage,
      duration: this.CONSTANTS.createFingerprintProfileDuration,
      position: "top",
    }).present();
  }


  private displayDestroyProfileDialog(username: string): Promise<boolean> {
    let message = _.template( this.CONSTANTS.destroyFingerprintProfileConfirmMessage )({
      username,
      fingerprintAuthName: this.platformFingerprintLabel
    });

    return this.dialogs.confirm( message, "", [ this.BUTTONS.YES, this.BUTTONS.NO ] )
      .then( (result: number) => Promise.resolve(result === 1) );
  }
}
