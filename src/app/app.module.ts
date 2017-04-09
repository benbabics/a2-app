import { Http, XHRBackend, RequestOptions } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { LandingPage } from "../pages/landing/landing";
import { CardsPage } from "../pages/cards/cards";
import {
  ActionIndicator,
  WexList,
  WexListItem,
  WexListHeader,
  WexNavBar,
  WexStaticListPage,
  WexGreeking,
  WexDetailsView
} from "../components";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import {
  AuthProvider,
  CardProvider,
  SecureHttp,
  SessionManager,
  UserProvider,
  InvoiceProvider,
  WexNavController,
  PaymentProvider
} from "../providers";
import { WexCurrency, WexDate } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage,
    PaymentsPage,
    ActionIndicator,
    WexCurrency,
    WexDate,
    WexNavBar,
    WexList,
    WexListItem,
    WexListHeader,
    WexStaticListPage,
    WexGreeking,
    WexDetailsView
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
    CardsPage,
    PaymentsPage
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
    CardProvider,
    PaymentProvider,
    SessionManager,
    WexCurrency,
    WexDate,
    WexNavController
  ]
})
export class AppModule {}
