import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Dialogs } from "@ionic-native/dialogs";
import { OptionsPopoverPage } from "./../pages/landing/options-popover/options-popover";
import { WexCardNumberPipe } from "./../pipes/wex-card-number";
import { Http, XHRBackend, RequestOptions, HttpModule } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { LandingPage } from "../pages/landing/landing";
import { CardsPage } from "../pages/cards/cards";
import { CardsDetailsPage } from "./../pages/cards/details/cards-details";
import { DriversPage } from './../pages/drivers/drivers';
import { DriversDetailsPage } from './../pages/drivers/details/drivers-details';
import { UserEnrollmentFlow } from "../pages/login/user-enrollment-flow/user-enrollment-flow";
import {
  ActionIndicator,
  WexList,
  WexListItem,
  WexListHeader,
  WexNavBar,
  WexGreeking,
  WexDetailsView,
  WexInfoCard,
  WexAppSnackbarController,
  WexStaticListPageHeader,
  WexStaticListPageContent
} from "../components";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import {
  SecureHttp,
  SessionManager,
  NavBarController,
  WexPlatform,
  SecureStorage,
  Fingerprint,
  AndroidFingerprintService,
  IosFingerprintService,
  MockFingerprintService,
  SessionInfoRequestors,
  DefaultSessionInfoRequestors,
  SessionCache,
  NetworkService
} from "../providers";
import { WexCurrency, WexDate, WexSvgPipe, WexTrustedHtmlPipe } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";
import { LocalStorageModule } from "angular-2-local-storage";
import { CardsReissuePage } from "../pages/cards/reissue/cards-reissue";
import { TermsOfUsePage } from "../pages/terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../pages/privacy-policy/privacy-policy";
import { AppVersion } from "@ionic-native/app-version";
import { TransactionsPage } from "../pages/transactions/transactions";
import { ApiProviders } from "@angular-wex/api-providers";
import { GetCurrentEnvironmentConstants } from "./app.constants";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import {
  WexIfPlatformDirective,
  WexIfPlatformAndroidDirective,
  WexIfPlatformIosDirective
} from "../directives";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Network } from "@ionic-native/network";

@NgModule({
  declarations: [
    //# app delcarations
    //----------------------
    MyApp,
    LoginPage,
    LandingPage,
    UserEnrollmentFlow,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
    DriversPage,
    DriversDetailsPage,
    PaymentsPage,
    TermsOfUsePage,
    PrivacyPolicyPage,
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
    WexSvgPipe,
    WexTrustedHtmlPipe,
    WexIfPlatformDirective,
    WexIfPlatformAndroidDirective,
    WexIfPlatformIosDirective,
    ContactUsPage
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
    ApiProviders.withConstants(GetCurrentEnvironmentConstants),
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
    UserEnrollmentFlow,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
    DriversPage,
    DriversDetailsPage,
    PaymentsPage,
    WexNavBar,
    OptionsPopoverPage,
    TermsOfUsePage,
    TransactionsPage,
    ContactUsPage,
    PrivacyPolicyPage,
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
    InAppBrowser,
    //# app providers
    //----------------------
    {
      provide: Http,
      useClass: SecureHttp,
      deps: [XHRBackend, RequestOptions, NetworkService]
    },
    SessionManager,
    NavBarController,
    SecureStorage,
    WexPlatform,
    Fingerprint,
    AndroidFingerprintService,
    IosFingerprintService,
    MockFingerprintService,
    WexAppSnackbarController,
    {
      provide: SessionInfoRequestors,
      useClass: DefaultSessionInfoRequestors
    },
    SessionCache,
    NetworkService,
    Network
  ]
})
export class AppModule {}
