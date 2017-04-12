import { WexCardNumberPipe } from './../pipes/wex-card-number';
import { CardsDetailsPage } from "./../pages/cards/details/cards-details";
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
  NavBarController,
  PaymentProvider,
  WexPlatform,
  SecureStorage,
  Fingerprint,
  AndroidFingerprintService,
  IosFingerprintService,
  MockFingerprintService
} from "../providers";
import { WexCurrency, WexDate } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage,
    CardsDetailsPage,
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
    WexDetailsView,
    WexCardNumberPipe
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
    CardsDetailsPage,
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
    NavBarController,
    SecureStorage,
    WexPlatform,
    Fingerprint,
    AndroidFingerprintService,
    IosFingerprintService,
    MockFingerprintService
  ]
})
export class AppModule {}
