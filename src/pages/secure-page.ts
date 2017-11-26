import { Injector } from "@angular/core";
import { Page, PageDetails } from "./page";
import { Session } from "../models";
import { SessionCache, SessionManager, WexPlatform } from "../providers";

export abstract class SecurePage extends Page {

  private static readonly DEFAULT_REQUIRED_SESSION_DETAILS = [Session.Field.User];

  protected sessionCache: SessionCache;
  protected sessionManager: SessionManager;

  public platform: WexPlatform;

  protected session: Session = {} as Session; //TODO - Remove this when refactoring is complete

  constructor(pageDetails: PageDetails, injector: Injector, protected requiredSessionInfo?: Session.Field[]) {
    super(pageDetails, injector);

    this.sessionCache = this.injector.get(SessionCache);
    this.sessionManager = this.injector.get(SessionManager);
    this.platform = this.injector.get(WexPlatform);
    this.requiredSessionInfo = SecurePage.DEFAULT_REQUIRED_SESSION_DETAILS.concat(requiredSessionInfo || []);
  }

  ionViewCanEnter(): Promise<any> {
    // Request all session info required for this page
    return this.sessionCache.requireSome$(this.requiredSessionInfo)
      .map(session => this.session = session)
      .toPromise();
  }
}
