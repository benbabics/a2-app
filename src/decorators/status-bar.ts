import { MyApp } from "./../app/app.component";
import { GenericConstructor } from "./generic-constructor";
import { StatusBar } from "@ionic-native/status-bar";
import { WexPlatform } from "../providers/platform";


export type PageTheme = keyof { LIGHT, DARK };
export namespace PageTheme {
  export const Light: PageTheme = "LIGHT";
  export const Dark: PageTheme = "DARK";
}

const platform: () => WexPlatform = () => MyApp.injector.get(WexPlatform);
const statusBar: () => StatusBar = () => MyApp.injector.get(StatusBar);

const ANDROID_STATUS_BAR_COLOR = {
  LIGHT:  "#e0e0e0",
  DARK: "#000000"
};

function setStatusBarForDarkPage() {
  if (platform().isIos) {
    statusBar().styleLightContent();
  } else {
    statusBar().backgroundColorByHexString(ANDROID_STATUS_BAR_COLOR.DARK);
  }
}

function setStatusBarForLightPage() {
  if (platform().isIos) {
    statusBar().styleDefault();
  } else {
    statusBar().backgroundColorByHexString(ANDROID_STATUS_BAR_COLOR.LIGHT);
  }
}

const ionViewWillEnter = "ionViewWillEnter";

export function StatusBarStyle<T extends GenericConstructor>(theme: PageTheme): Function {
  return (constructor: T) => {
    return class extends constructor {
      public ionViewWillEnter() {
        if (theme === PageTheme.Light) {
          setStatusBarForLightPage();
        } else {
          setStatusBarForDarkPage();
        }

        if (super[ionViewWillEnter]) {
          super[ionViewWillEnter]();
        }
      }

    };
  };
}
