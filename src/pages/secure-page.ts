import { Injector } from "@angular/core";
import { Page, PageParams } from "./page";
import { Session } from "../models";
import { SessionCache } from "../providers";

export abstract class SecurePage extends Page {

  private static readonly DEFAULT_REQUIRED_SESSION_DETAILS = [Session.Field.User];

  protected session: Session = {};
  protected sessionCache: SessionCache;

  constructor(pageName: string, injector: Injector, protected requiredSessionInfo?: Session.Field[], params?: PageParams) {
    super(pageName, injector, params);

    this.sessionCache = this.injector.get(SessionCache);
    this.requiredSessionInfo = SecurePage.DEFAULT_REQUIRED_SESSION_DETAILS.concat(requiredSessionInfo || []);
  }

  ionViewCanEnter(): Promise<any> {
    // Request all session info required for this page
    return this.sessionCache.getSessionDetails(this.requiredSessionInfo)
      .map((session: Session) => this.session = session)
      .toPromise();
  }
}
