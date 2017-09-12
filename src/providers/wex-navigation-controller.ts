import { Injectable, Inject, forwardRef } from "@angular/core";
import { AppSymbols } from "../app/app.symbols";
import { App } from "ionic-angular";
import { SessionManager } from "./session-manager";

@Injectable()
export class WexNavigationController {

  constructor(
    @Inject(AppSymbols.RootPage) private rootPage: any,
    @Inject(forwardRef(() => SessionManager)) private sessionManager: SessionManager,
    private app: App
  ) { }

  public logout(params?: any) {
    this.app.getRootNav().setRoot(this.rootPage, params, { animate: true, direction: "back" })
      .then(() => this.sessionManager.invalidateSession());
  }
}