import { WexAppBackButtonController } from "./../providers";
import { NavBarController } from "./../providers/nav-bar-controller";
import { MyApp } from "./../app/app.component";
import { GenericConstructor } from "./generic-constructor";

const ionViewDidEnter = "ionViewDidEnter", ionViewWillLeave = "ionViewWillLeave";

export function TabPage<T extends GenericConstructor>(): Function {
  return (constructor: T) => {
    return class extends constructor {
      private get wexAppBackButtonController(): WexAppBackButtonController { return MyApp.injector.get(WexAppBackButtonController); }
      private get navBarController(): NavBarController { return MyApp.injector.get(NavBarController); }

      public ionViewDidEnter() {
        // Tab [0] is the landing page.
        this.wexAppBackButtonController.registerAction(() => this.navBarController.ionTabs.select(0));

        if (super[ionViewDidEnter]) {
          super[ionViewDidEnter]();
        }
      }

      public ionViewWillLeave() {
        this.wexAppBackButtonController.deregisterAction();

        if (super[ionViewWillLeave]) {
          super[ionViewWillLeave]();
        }
      }
    };
  };
}
