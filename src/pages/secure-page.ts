import { Injector } from '@angular/core';
import { SessionManager } from './../providers/session-manager';
import { Page } from "./page";
import { Session } from "../models";

export abstract class SecurePage extends Page {

  private static readonly DEFAULT_REQUIRED_SESSION_DETAILS = [Session.Field.User];
  public sessionManager: SessionManager;

  protected session: Session;

  constructor(pageName: string, injector: Injector, protected requiredSessionInfo?: Session.Field[]) {
    super(pageName, injector);

    this.sessionManager = this.injector.get(SessionManager);
    this.requiredSessionInfo = requiredSessionInfo || SecurePage.DEFAULT_REQUIRED_SESSION_DETAILS;
  }

  ionViewCanEnter(): Promise<any> {
    // Request all session info required for this page
    return this.sessionManager.cache.getSessionDetails(this.requiredSessionInfo)
      .map((session: Session) => this.session = session)
      .toPromise();
  }
}
