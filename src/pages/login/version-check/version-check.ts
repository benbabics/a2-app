import { Component, Injector } from '@angular/core';
import { Page } from '../../page';
import { NavParams, ViewController } from 'ionic-angular';
import { VersionStatus } from '@angular-wex/models';
import { WexPlatform } from '../../../providers/platform';
import { Market } from '@ionic-native/market';

@Component({
  selector: "version-check",
  templateUrl: "version-check.html"
}) export class VersionCheck extends Page {
  public status: VersionStatus;

  constructor(private viewController: ViewController,
    private wexPlatform: WexPlatform,
    private market: Market,
    navParams: NavParams,
    injector: Injector
  ) {
    super("Version Check", injector);
    this.status = navParams.get("status") as VersionStatus;
  }

  public get canSkipUpdate() {
    return this.status !== VersionStatus.Unsupported;
  }

  public skipUpdate() {
    this.viewController.dismiss();
  }

  public update() {
    this.market.open(this.CONSTANTS.APP_STORES[this.wexPlatform.os]);
  }


}