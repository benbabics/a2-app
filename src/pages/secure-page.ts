import { Injector } from "@angular/core";
import { Page, PageDetails } from "./page";
import { Session } from "../models";
import { SessionCache, SessionManager } from "../providers";
import { StateEmitter } from "angular-rxjs-extensions";
import { Observable } from "rxjs";

export abstract class SecurePage extends Page {

  private static readonly DEFAULT_REQUIRED_SESSION_DETAILS = [Session.Field.User];

  @StateEmitter.Alias("sessionManager.cache.session$")
  protected session$: Observable<Session>;

  protected session: Session = {} as Session;
  protected sessionCache: SessionCache;
  protected sessionManager: SessionManager;

  constructor(pageDetails: PageDetails, injector: Injector, protected requiredSessionInfo?: Session.Field[]) {
    super(pageDetails, injector);

    this.sessionCache = this.injector.get(SessionCache);
    this.sessionManager = this.injector.get(SessionManager);
    this.requiredSessionInfo = SecurePage.DEFAULT_REQUIRED_SESSION_DETAILS.concat(requiredSessionInfo || []);
  }

  ionViewCanEnter(): Promise<any> {
    // Request all session info required for this page
    return this.sessionCache.updateSome$(this.requiredSessionInfo)
      .map((session: Session) => this.session = session)
      .toPromise();
  }
}
