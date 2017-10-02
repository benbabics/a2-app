import { Injectable } from "@angular/core";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Value } from "../decorators/value";
import { SessionManager } from "./session-manager";
import { WexNavigationController } from "./wex-navigation-controller";
import { WexPlatform } from "./platform";
import * as moment from "moment";

@Injectable()
export class UserIdle {

  @Value("USER_IDLE") private readonly CONSTANTS;
  private timeAtPause: moment.Moment;
  private durationAtPause: moment.Duration;
  private readonly timeoutSession = () => this.wexNavigationController.logout({ "fromTimeout": true });
  public readonly timeoutIfIdle = () => {
    let duration: number = moment.duration(moment().diff(this.timeAtPause)).add(this.durationAtPause).asSeconds();
    if (duration > this.CONSTANTS.TIMEOUT_DURATION) {
      this.timeoutSession();
    }
  }

  constructor(
    sessionManager: SessionManager,
    private idle: Idle,
    private wexNavigationController: WexNavigationController,
    private platform: WexPlatform
  ) {
    this.configureTimeout();
    this.platform.ready(() => this.platform.resume.subscribe(this.timeoutIfIdle))
      .then(() => this.platform.pause.subscribe(() => {
        this.durationAtPause = moment.duration(this.idle.getIdle(), "seconds");
        this.timeAtPause = moment();
      }));
    sessionManager.sessionStateObserver.subscribe(session => this.onSessionChange(session));
  }

  private configureTimeout() {
    this.idle.setIdle(1);
    this.idle.setTimeout(this.CONSTANTS.TIMEOUT_DURATION);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(this.timeoutSession);
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
