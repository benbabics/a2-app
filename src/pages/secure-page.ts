import { SessionManager } from './../providers/session-manager';
import { Page } from "./page";
import { Session } from "../models";

export abstract class SecurePage extends Page {

  private static readonly DEFAULT_REQUIRED_SESSION_DETAILS = [Session.Field.User];

  protected session: Session;

  constructor(pageName: string, protected sessionManager: SessionManager, protected requiredSessionInfo?: Session.Field[]) {
    super(pageName);

    this.requiredSessionInfo = requiredSessionInfo || SecurePage.DEFAULT_REQUIRED_SESSION_DETAILS;
  }

  ionViewCanEnter(): Promise<any> {
    // Request all session info required for this page
    return this.sessionManager.getSessionInfo(this.requiredSessionInfo)
      .map((session: Session) => this.session = session)
      .toPromise();
  }
}
