import { SessionManager } from './../providers/session-manager';
import { Page } from "./page";
import { Session } from "../models";

export abstract class SecurePage extends Page {

  public get session(): Session {
    return SessionManager.currentSession;
  }
}
