import { Injectable } from "@angular/core";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Value } from "../decorators/value";
import { WexPlatform } from "./platform";

@Injectable()
export class UserIdle {

  @Value("USER_IDLE") private readonly CONSTANTS;

  constructor(private idle: Idle, private platform: WexPlatform) { }

  private configureTimeout() {
    this.idle.setTimeout(this.CONSTANTS.TIMEOUT_DURATION);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => this.platform.logout({ "fromLogOut": true }));
    this.idle.watch();
  }
}
