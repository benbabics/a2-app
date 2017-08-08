import { Injectable } from "@angular/core";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Value } from "../decorators/value";
import { SessionManager } from "./session-manager";
import { Session } from "../models";

@Injectable()
export class UserIdle {

  @Value("USER_IDLE") private readonly CONSTANTS;

  constructor(private idle: Idle, private sessionManager: SessionManager) {
    this.configureTimeout();

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private configureTimeout() {
    this.idle.setIdle(1);
    this.idle.setTimeout(this.CONSTANTS.TIMEOUT_DURATION);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => this.sessionManager.logout({ "fromLogOut": true }));
  }

  private onSessionChange(session: boolean) {
    if (session) {
      this.startWatch();
    }
    else {
      this.endWatch();
    }
  }

  public startWatch() {
    this.idle.watch();
  }

  public endWatch() {
    this.idle.stop();
  }
}
