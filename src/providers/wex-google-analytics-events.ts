import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Value } from "../decorators/value";
import { Injectable } from "@angular/core";
import { SessionManager } from "./session-manager";
import { Session } from "../models";
import { User } from "@angular-wex/models";
import { PlatformReady } from "../decorators/platform-ready";
import { WexPlatform } from "./platform";

@Injectable()
export class WexGoogleAnalyticsEvents extends GoogleAnalytics {

  @Value("GOOGLE_ANALYTICS.TRACKING_ID")
  private TRACKING_ID: string;
  private readonly USER_ID_DIMENSION: number = 1;

  constructor(sessionManager: SessionManager, wexPlatform: WexPlatform) {
    super();

    if (!this.hasTrackingId) {
      console.warn("No TRACKING_ID found for Google Analytics for this session.");
    } else {
      wexPlatform.ready(() => super.startTrackerWithId(this.TRACKING_ID));
    }

    // Track the user via username when logged in
    sessionManager.sessionStateObserver.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        sessionManager.cache
          .getSessionDetail(Session.Field.User)
          .subscribe((user: User) => this.setUserId(user.details.username));
      }
    });
  }

  @PlatformReady(GoogleAnalytics)
  public setUserId(userId: string): Promise<any> {
    if (this.hasTrackingId) {
      return super.setUserId(userId).then(() => super.addCustomDimension(this.USER_ID_DIMENSION, userId));
    }
    else {
      return Promise.resolve();
    }
  }

  @PlatformReady(GoogleAnalytics)
  public trackView(view: string): Promise<any> {
    return this.hasTrackingId ? super.trackView(view) : Promise.resolve();
  }

  @PlatformReady(GoogleAnalytics)
  public trackEvent(category: string, action: string, label?: string, value?: number, newSession?: boolean): Promise<any> {
    return this.hasTrackingId ? super.trackEvent(category, action, label, value, newSession) : Promise.resolve();
  }

  private get hasTrackingId(): boolean {
    return !!this.TRACKING_ID;
  }
}