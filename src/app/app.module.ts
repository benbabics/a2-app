import { Dialogs } from "@ionic-native/dialogs";
import { OptionsPopoverPage } from "./../pages/landing/options-popover/options-popover";
import { WexCardNumberPipe } from "./../pipes/wex-card-number";
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
  WexDetailsView,
  WexInfoCard,
  WexBanner,
  WexAppBannerController,
  WexAppBanner,
  WexSnackbar
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
  MockFingerprintService,
  AccountProvider
} from "../providers";
import { WexCurrency, WexDate } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";
import { LocalStorageModule } from "angular-2-local-storage";
import { CardsReissuePage } from "../pages/cards/reissue/cards-reissue";

@NgModule({
  declarations: [
    //# app delcarations
    //----------------------
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
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
    WexCardNumberPipe,
    OptionsPopoverPage,
    WexInfoCard,
    WexBanner,
    WexAppBanner,
    WexSnackbar
  ],
  imports: [
    //# ionic
    //----------------------
    IonicModule.forRoot(MyApp),
    //# third party dependencies
    //----------------------
    ChartsModule,
    LocalStorageModule.withConfig({ storageType: "localStorage" })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LandingPage,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
    PaymentsPage,
    WexNavBar,
    OptionsPopoverPage
  ],
  providers: [
    //# ionic
    //----------------------
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //# ionic-native
    //----------------------
    Dialogs,
    StatusBar,
    SplashScreen,
    //# app providers
    //----------------------
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
    AccountProvider,
    SessionManager,
    NavBarController,
    SecureStorage,
    WexPlatform,
    Fingerprint,
    AndroidFingerprintService,
    IosFingerprintService,
    MockFingerprintService,
    WexAppBannerController
  ]
})
export class AppModule {}
