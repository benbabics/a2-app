import { WexAlertController } from "./../components/wex-alert-controller/wex-alert-controller";
import { ProgressBarModule } from "primeng/primeng";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Dialogs } from "@ionic-native/dialogs";
import { OptionsPopoverPage } from "./../pages/landing/options-popover/options-popover";
import { WexCardNumberPipe } from "./../pipes/wex-card-number";
import { Http, XHRBackend, RequestOptions, HttpModule } from "@angular/http";
import { NgModule, ErrorHandler, APP_INITIALIZER } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { FingerprintAuthenticationTermsPage } from "../pages/login/fingerprint-auth-terms/fingerprint-auth-terms";
import { LandingPage } from "../pages/landing/landing";
import { CardsPage } from "../pages/cards/cards";
import { SettingsPage } from "../pages/settings/settings";
import { CardsDetailsPage } from "./../pages/cards/details/cards-details";
import { DriversPage } from "./../pages/drivers/drivers";
import { DriversDetailsPage } from "./../pages/drivers/details/drivers-details";
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
  WexStaticListPageContent,
  WexInvoiceDisplay,
  ResizableSvg
} from "../components";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Market } from "@ionic-native/market";
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
  NetworkStatus,
  WexGoogleAnalyticsEvents,
  WexAppBackButtonController,
  UserIdle
} from "../providers";
import { WexCurrency, WexDate, WexDateTime, WexSvgPipe, WexTrustedHtmlPipe } from "../pipes";
import { PaymentsPage } from "../pages/payments/payments";
import { PaymentsDetailsPage } from "../pages/payments/details/payments-details";
import { LocalStorageModule } from "angular-2-local-storage";
import { CardsReissuePage } from "../pages/cards/reissue/cards-reissue";
import { TermsOfUsePage } from "../pages/terms-of-use/terms-of-use";
import { PrivacyPolicyPage } from "../pages/privacy-policy/privacy-policy";
import { AppVersion } from "@ionic-native/app-version";
import { TransactionsPage } from "../pages/transactions/transactions";
import { TransactionDetailsPage } from "../pages/transactions/details/transaction-details";
import { ApiProviders } from "@angular-wex/api-providers";
import { GetCurrentEnvironmentConstants } from "./app.constants";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import {
  WexIfPlatformDirective,
  WexIfPlatformAndroidDirective,
  WexIfPlatformIosDirective,
  WexKeyboardAware,
  WexClear
} from "../directives";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AddPaymentPage } from "../pages/payments/add/add-payment";
import { AngularWexValidatorsModule } from "@angular-wex/validators";
import { AddPaymentConfirmationPage } from "../pages/payments/add/confirmation/add-payment-confirmation";
import { AddPaymentSummaryPage } from "../pages/payments/add/summary/add-payment-summary";
import { Network } from "@ionic-native/network";
import { WexAppVersionCheck } from "../providers/wex-app-version-check";
import { VersionCheck } from "../pages/login/version-check/version-check";
import { AppSymbols } from "./app.symbols";
import { NgIdleModule } from "@ng-idle/core";
import { Environment } from "../environments/environment";
import { MockBackend } from "@angular/http/testing";
import { MockHttp } from "@angular-wex/mocks";
import { ModelGeneratorsModule } from "@angular-wex/models/mocks";
import { MockResponsesModule } from "@angular-wex/api-providers/mocks";

export function APP_INITIALIZER_FACTORY() {
  return function () { };
}

export function HTTP_FACTORY(xhrBackend: XHRBackend, mockBackend: MockBackend, networkStatus: NetworkStatus, requestOptions: RequestOptions) {
  if (Environment.IsMockBackend === true) {
    return new MockHttp(mockBackend, requestOptions);
  }
  else {
    return new SecureHttp(xhrBackend, requestOptions, networkStatus);
  }
}

@NgModule({
  declarations: [
    //# app delcarations
    //----------------------
    MyApp,
    LoginPage,
    FingerprintAuthenticationTermsPage,
    VersionCheck,
    LandingPage,
    UserEnrollmentFlow,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
    DriversPage,
    DriversDetailsPage,
    PaymentsPage,
    PaymentsDetailsPage,
    SettingsPage,
    TermsOfUsePage,
    PrivacyPolicyPage,
    TransactionsPage,
    AddPaymentPage,
    AddPaymentConfirmationPage,
    AddPaymentSummaryPage,
    TransactionDetailsPage,
    ActionIndicator,
    WexCurrency,
    WexDate,
    WexDateTime,
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
    ContactUsPage,
    WexInvoiceDisplay,
    WexKeyboardAware,
    WexClear,
    ResizableSvg
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
    AngularWexValidatorsModule,
    ModelGeneratorsModule,
    MockResponsesModule,
    //# third party dependencies
    //----------------------
    LocalStorageModule.withConfig({ storageType: "localStorage" }),
    NgIdleModule.forRoot(),
    ProgressBarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    FingerprintAuthenticationTermsPage,
    VersionCheck,
    LandingPage,
    UserEnrollmentFlow,
    CardsPage,
    CardsDetailsPage,
    CardsReissuePage,
    DriversPage,
    DriversDetailsPage,
    PaymentsPage,
    PaymentsDetailsPage,
    SettingsPage,
    WexNavBar,
    OptionsPopoverPage,
    TermsOfUsePage,
    TransactionsPage,
    TransactionDetailsPage,
    ContactUsPage,
    PrivacyPolicyPage,
    TransactionsPage,
    AddPaymentPage,
    AddPaymentConfirmationPage,
    AddPaymentSummaryPage,
    PrivacyPolicyPage
  ],
  providers: [
    //# angular
    //----------------------
    MockBackend,
    //# ionic
    //----------------------
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    //# ionic-native
    //----------------------
    Dialogs,
    StatusBar,
    SplashScreen,
    AppVersion,
    InAppBrowser,
    Keyboard,
    Network,
    Market,
    //# app providers
    //----------------------
    { // Force service instatiation
      provide: APP_INITIALIZER,
      useFactory: APP_INITIALIZER_FACTORY,
      deps: [UserIdle],
      multi: true
    },
    {
      provide: AppSymbols.RootPage,
      useValue: LoginPage
    },
    {
      provide: SessionInfoRequestors,
      useClass: DefaultSessionInfoRequestors
    },
    {
      provide: GoogleAnalytics,
      useClass: WexGoogleAnalyticsEvents
    },
    {
      provide: GoogleAnalytics,
      useClass: WexGoogleAnalyticsEvents
    },
    {
      provide: Http,
      useFactory: HTTP_FACTORY,
      deps: [XHRBackend, MockBackend, NetworkStatus, RequestOptions]
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
    SessionCache,
    NetworkStatus,
    WexAlertController,
    WexAppVersionCheck,
    WexAppBackButtonController,
    UserIdle
  ]
})
export class AppModule {}
