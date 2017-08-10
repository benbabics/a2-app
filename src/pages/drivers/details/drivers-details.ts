import { WexAppSnackbarController } from './../../../components/wex-app-snackbar-controller/wex-app-snackbar-controller';
import { ActionSheetButton } from 'ionic-angular/components/action-sheet/action-sheet-options';
import { ActionSheetController, Events, ToastOptions, Platform } from 'ionic-angular';
import * as _ from "lodash";
import { Component, Injector } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Driver, DriverStatus, OnlineApplication } from '@angular-wex/models';
import { DriverProvider } from "@angular-wex/api-providers"
import { DetailsPage } from "../../details-page";
import { ActionSheetOptions } from 'ionic-angular/components/action-sheet/action-sheet-options';
import { WexAlertController } from '../../../components/wex-alert-controller/wex-alert-controller';

interface DriverStatusDetails {
  id: DriverStatus;
  label: string;
  trackingId: string;
  icon: string;
};
@Component({
  selector: "page-drivers-details",
  templateUrl: "drivers-details.html"
})
export class DriversDetailsPage extends DetailsPage {
  public driver: Driver;
  public isChangingStatus: boolean = false;

  constructor(
    public navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private wexAlertController: WexAlertController,
    private driverProvider: DriverProvider,
    private wexAppSnackbarController: WexAppSnackbarController,
    private events: Events,
    private platform: Platform,
    injector: Injector
  ) {
    super( "Drivers.Details", injector );
    this.driver = this.navParams.get( "driver" );
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[ this.driver.details.status ] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[ this.driver.details.status ] || "information-circled";
  }

  public get areFieldsAccessible(): boolean {
    const userPlatform = this.session.user.details.onlineApplication;
    const accessibleFields = [OnlineApplication.DISTRIBUTOR, OnlineApplication.WOL_NP];

    return _.includes( accessibleFields, userPlatform );
  }

  public changeStatus() {
    let actions = this.CONSTANTS.statusOptions as DriverStatusDetails[];
    this.actionSheetController.create(this.buildActionSheet(actions)).present();
  }

  private buildActionSheet(actions: DriverStatusDetails[]): ActionSheetOptions {
    let buttons: ActionSheetButton[] = actions.map(action => ({
      text: action.label,
      icon: !this.platform.is("ios") ? action.icon : null,
      handler: () => {
        if (action.id === this.CONSTANTS.statuses.TERMINATED) {
          this.confirmTermination();
        } else {
          this.updateDriverStatus(action.id);
        }
      }
    }));
    return {
      title: this.CONSTANTS.actionStatusTitle,
      buttons: [
        ...buttons,
        {
          text: this.CONSTANTS.actionStatusCancel,
          role: "cancel",
          icon: !this.platform.is("ios") ? "close" : null
        }
      ]
    }
  }

  private confirmTermination() {
    let message = this.CONSTANTS.confirmMessageTerminate;
    let yesHandler = () => this.updateDriverStatus(this.CONSTANTS.statuses.TERMINATED as DriverStatus);
    this.wexAlertController.confirmation(message, yesHandler);
  }

  private updateDriverStatus(newStatus: DriverStatus) {
    if (newStatus === this.driver.details.status) {
      return;
    }

    this.isChangingStatus = true;

    let accountId = this.session.user.billingCompany.details.accountId;
    let driverId = this.driver.details.driverId;
    let promptId = this.driver.details.promptId;

    let toastOptions: ToastOptions = {
      message: null,
      duration: this.CONSTANTS.statusUpdateMessageDuration,
      position: 'top',
    };

    this.driverProvider.updateStatus(accountId, driverId, newStatus, promptId).subscribe(
      (driver: Driver) => {
        this.driver.details.status = driver.details.status;
        this.isChangingStatus = false;
        this.events.publish("drivers:statusUpdate");

        toastOptions.message = this.CONSTANTS.bannerStatusChangeSuccess;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      }, () => {
        this.isChangingStatus = false;
        toastOptions.message = this.CONSTANTS.bannerStatusChangeFailure;
        this.wexAppSnackbarController.createQueued(toastOptions).present();
      });
  }
}
