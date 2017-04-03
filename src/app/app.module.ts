import { Http, XHRBackend, RequestOptions } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { LandingPage } from "../pages/landing/landing";
import { CardsPage } from "../pages/cards/cards";
import { ActionIndicator, WexNavBar } from "../components";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AuthProvider, SecureHttp, SessionManager, UserProvider, InvoiceProvider, WexNavController } from "../providers";
import { WexCurrency, WexDate } from "../pipes";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage,
    ActionIndicator,
    WexCurrency,
    WexDate,
    WexNavBar
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: Http,
      useClass: SecureHttp,
      deps: [XHRBackend, RequestOptions]
    },
    AuthProvider,
    InvoiceProvider,
    UserProvider,
    SessionManager,
    WexCurrency,
    WexDate,
    WexNavController
  ]
})
export class AppModule {}
