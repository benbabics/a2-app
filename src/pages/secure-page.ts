import { SessionManager } from './../providers/session-manager';
import { Page } from "./page";
import { Session } from "../models";

export abstract class SecurePage extends Page {

  ionViewCanEnter(): boolean {
    return SessionManager.hasActiveSession; //TODO check if session is valid
  }

  public get session(): Session {
    return SessionManager.currentSession;
  }
}
