import { WexAppBackButtonController } from "./../providers";
import { NavBarController } from "./../providers/nav-bar-controller";
import { MyApp } from "./../app/app.component";
import { GenericConstructor } from "./generic-constructor";

const ionViewDidEnter = "ionViewDidEnter", ionViewWillLeave = "ionViewWillLeave";
const wexAppBackButtonController: () => WexAppBackButtonController = () => { return MyApp.injector.get(WexAppBackButtonController); };
const navBarController: () => NavBarController = () => { return MyApp.injector.get(NavBarController); };

export function TabPage<T extends GenericConstructor>(): Function {
  return (constructor: T) => {
    return class extends constructor {
      public ionViewDidEnter() {
        // Tab [0] is the landing page.
        wexAppBackButtonController().registerAction(() => navBarController().ionTabs.select(0));

        if (super[ionViewDidEnter]) {
          super[ionViewDidEnter]();
        }
      }

      public ionViewWillLeave() {
        wexAppBackButtonController().deregisterAction();

        if (super[ionViewWillLeave]) {
          super[ionViewWillLeave]();
        }
      }
    };
  };
}
