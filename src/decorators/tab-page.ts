import { NavBarController } from './../providers/nav-bar-controller';
import { MyApp } from './../app/app.component';
import { Platform } from 'ionic-angular';
import { Injector } from '@angular/core';
import { LandingPage } from '../pages/landing/landing';

type GenericConstructor = { new (...args: any[]): any };
const ionViewDidEnter = "ionViewDidEnter", ionViewDidLeave = "ionViewDidLeave";

export function TabPage<T extends GenericConstructor>(): Function {
  return (constructor: T) => {
    return class extends constructor {
      private unregisterBackButton: Function;
      private get platform(): Platform { return MyApp.injector.get(Platform); };
      private get navBarController(): NavBarController { return MyApp.injector.get(NavBarController); }
    
      public ionViewDidEnter() {
        this.unregisterBackButton = this.platform.registerBackButtonAction(() => this.navBarController.select(LandingPage), 101);

        if (super[ionViewDidEnter]) {
          super[ionViewDidEnter]();
        }
      }

      public ionViewDidLeave() {
        this.unregisterBackButton();

        if (super[ionViewDidLeave]) {
          super[ionViewDidLeave]();
        }
      }
    }
  }
}
