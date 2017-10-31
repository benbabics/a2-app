import { Component, Injector } from "@angular/core";
import { Page } from "../../page";
import { ViewController } from "ionic-angular";
import { WexPlatform, UiNotificationsController } from "../../../providers";
import { FingerprintLogProvider } from "@angular-wex/api-providers";
import { Observable } from "rxjs";
import { StatusBarStyle, PageTheme } from "../../../decorators/status-bar";

@StatusBarStyle(PageTheme.Light)
@Component({
  selector: "modal-fingerprint-auth-terms",
  templateUrl: "fingerprint-auth-terms.html"
})
export class FingerprintAuthenticationTermsPage extends Page {

  constructor(
    private uiNotificationsController: UiNotificationsController,
    public platform: WexPlatform,
    private viewControl: ViewController,
    private fingerprintLogProvider: FingerprintLogProvider,
    injector: Injector
  ) {
    super("Fingerprint Auth Terms", injector);
  }

  public response(accepted: boolean) {
    // If the call to the server fails, don't let the user setup fingerprint auth
    this.trackResponse(accepted).subscribe(
      null,
      () => {
        this.uiNotificationsController.presentFingerprintProfileErrorMessage();
        this.viewControl.dismiss(false);
      },
      () => this.viewControl.dismiss(accepted)
    );
  }

  private trackResponse(accepted: boolean): Observable<any> {
    this.trackAnalyticsEvent(accepted ? "acceptTerms" : "declineTerms");

    if (accepted) {
      return this.fingerprintLogProvider.logAcceptance();
    }
    else {
      return Observable.empty();
    }
  }
}
