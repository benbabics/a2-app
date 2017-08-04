import { WexAppBackButtonController } from "./../providers";
import { NavBarController } from './../providers/nav-bar-controller';
import { MyApp } from './../app/app.component';
import { Injector } from '@angular/core';
import { LandingPage } from '../pages/landing/landing';

type GenericConstructor = { new (...args: any[]): any };
const ionViewDidEnter = "ionViewDidEnter", ionViewWillLeave = "ionViewWillLeave";

export function TabPage<T extends GenericConstructor>(): Function {
  return (constructor: T) => {
    return class extends constructor {
      private get wexAppBackButtonController(): WexAppBackButtonController { return MyApp.injector.get(WexAppBackButtonController); };
      private get navBarController(): NavBarController { return MyApp.injector.get(NavBarController); }
    
      public ionViewDidEnter() {
        this.wexAppBackButtonController.registerAction(() => this.navBarController.select(LandingPage));
        console.log("ENTER");

        if (super[ionViewDidEnter]) {
          super[ionViewDidEnter]();
        }
      }

      public ionViewWillLeave() {
        this.wexAppBackButtonController.deregisterAction();
        console.log("LEAVE");

        if (super[ionViewWillLeave]) {
          super[ionViewWillLeave]();
        }
      }
    }
  }
}
