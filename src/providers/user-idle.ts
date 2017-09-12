import { Injectable, Inject, forwardRef } from "@angular/core";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Value } from "../decorators/value";
import { SessionManager } from "./session-manager";
import { WexNavigationController } from "./wex-navigation-controller";

@Injectable()
export class UserIdle {

  @Value("USER_IDLE") private readonly CONSTANTS;

  constructor(
    @Inject(forwardRef(() => SessionManager)) sessionManager: SessionManager,
    private idle: Idle,
    private wexNavigationController: WexNavigationController
  ) {
    this.configureTimeout();

    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private configureTimeout() {
    this.idle.setIdle(1);
    this.idle.setTimeout(this.CONSTANTS.TIMEOUT_DURATION);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => this.wexNavigationController.logout({ "fromTimeout": true }));
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
