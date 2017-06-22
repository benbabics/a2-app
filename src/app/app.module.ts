import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Dialogs } from "@ionic-native/dialogs";
import { OptionsPopoverPage } from "./../pages/landing/options-popover/options-popover";
import { WexCardNumberPipe } from "./../pipes/wex-card-number";
import { CardsDetailsPage } from "./../pages/cards/details/cards-details";
import { Http, XHRBackend, RequestOptions, HttpModule } from "@angular/http";
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
  WexGreeking,
  WexDetailsView,
  WexInfoCard,
  WexBanner,
  WexAppBannerController,
  WexAppBanner,
  WexSnackbar,
  WexStaticListPageHeader,
  WexStaticListPageContent
} from "../components";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
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
  AccountProvider,
  BrandProvider,
  SessionInfoRequestors,
  DefaultSessionInfoRequestors,
  DriverProvider,
  TransactionProvider,
  SessionCache
} from "../providers";
import { WexCurrency, WexDate, WexSvgPipe, WexTrustedHtmlPipe } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";
import { LocalStorageModule } from "angular-2-local-storage";
import { CardsReissuePage } from "../pages/cards/reissue/cards-reissue";
import { TermsOfUsePage } from "../pages/terms-of-use/terms-of-use";
import { AppVersion } from "@ionic-native/app-version";
import { TransactionsPage } from "../pages/transactions/transactions";
import { ModelGeneratorsModule } from "@angular-wex/models/mocks";

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
    TermsOfUsePage,
    TransactionsPage,
    ActionIndicator,
    WexCurrency,
    WexDate,
    WexNavBar,
    WexList,
    WexListItem,
    WexListHeader,
    WexStaticListPageHeader,
    WexStaticListPageContent,
    WexGreeking,
    WexDetailsView,
    WexCardNumberPipe,
    OptionsPopoverPage,
    WexInfoCard,
    WexBanner,
    WexAppBanner,
    WexSnackbar,
    WexSvgPipe,
    WexTrustedHtmlPipe
  ],
  imports: [
    //# Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    //# ionic
    //----------------------
    IonicModule.forRoot(MyApp),
    //# WEX
    //----------------------
    ModelGeneratorsModule,
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
    OptionsPopoverPage,
    TermsOfUsePage,
    TransactionsPage
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
    AppVersion,
    Keyboard,
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
    BrandProvider,
    SessionManager,
    NavBarController,
    SecureStorage,
    WexPlatform,
    Fingerprint,
    AndroidFingerprintService,
    IosFingerprintService,
    MockFingerprintService,
    WexAppBannerController,
    {
      provide: SessionInfoRequestors,
      useClass: DefaultSessionInfoRequestors
    },
    DriverProvider,
    TransactionProvider,
    SessionCache
  ]
})
export class AppModule {}
