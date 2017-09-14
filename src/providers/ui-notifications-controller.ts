import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { SessionCache } from "./session-cache";
import { Value } from "../decorators/value";
import { FingerprintAuthenticationTermsPage } from "../pages/login/fingerprint-auth-terms/fingerprint-auth-terms";
import { ModalController } from "ionic-angular";
import { WexPlatform } from "./platform";
import { WexAppSnackbarController } from "../components/wex-app-snackbar-controller/wex-app-snackbar-controller";
import { NameUtils } from "../utils/name-utils";
import { User } from "@angular-wex/models";
import { Session } from "../models/session";
import { LocalStorageService } from "angular-2-local-storage/dist";
import { Fingerprint } from "./fingerprint/fingerprint";

@Injectable()
export class UiNotificationsController {

  @Value("GLOBAL_NOTIFICATIONS.fingerprintSuccess.message")
  private readonly FINGERPRINT_SUCCESS: string;
  @Value("GLOBAL_NOTIFICATIONS.fingerprintSuccess.duration")
  private readonly FINGERPRINT_SUCCESS_DURATION: number;

  constructor(
    private sessionCache: SessionCache,
    private modalController: ModalController,
    private platform: WexPlatform,
    private localStorageService: LocalStorageService,
    private fingerprint: Fingerprint,
    private wexAppSnackbarController: WexAppSnackbarController
  ) { }

  public presentFingerprintProfileSuccessMessage() {
    this.sessionCache.getSessionDetail(Session.Field.User).subscribe((user: User) => {
      this.fingerprint.hasProfile(user.details.username).then((hasProfile: boolean ) => {
        if (hasProfile && !this.localStorageService.get(Fingerprint.hasShownFingerprintSetupMessageKey)) {
        let message = _.template(this.FINGERPRINT_SUCCESS)({
          platformBiometric: this.platform.fingerprintTitle(),
          username: NameUtils.MaskUsername(user.details.username).toUpperCase()
        });
        this.wexAppSnackbarController.create({
          message,
          duration: this.FINGERPRINT_SUCCESS_DURATION
        }).present();
        this.localStorageService.set(Fingerprint.hasShownFingerprintSetupMessageKey, true);
      }});
    });
  }

  public promptFingerprintTerms(): Observable<boolean> {
    let modal = this.modalController.create(FingerprintAuthenticationTermsPage);
    modal.present();

    return new Observable<boolean>((observer: Subscriber<boolean>) => {
      modal.onDidDismiss((accepted: boolean) => {
        observer.next(accepted);
        observer.complete();
      });
    });
  }
}
