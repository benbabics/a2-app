(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("landing", {
            url: "/landing?{showFingerprintBanner:bool}",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/landing/templates/landing.html",
                    controller: "LandingController as vm",
                    resolve    : {
                        accountId: function (UserManager) {
                            return UserManager.getUser().billingCompany.accountId;
                        },

                        fetchCurrentInvoiceSummary: function (accountId, InvoiceManager) {
                            return () => InvoiceManager.fetchCurrentInvoiceSummary(accountId);
                        },

                        fetchScheduledPaymentsCount: function (accountId, globals, PaymentManager) {
                            return () => PaymentManager.fetchScheduledPaymentsCount(accountId);
                        },

                        brandLogo: function ( LoadingIndicator, BrandManager ) {
                            LoadingIndicator.begin();
                            return BrandManager.fetchBrandLogo(LoadingIndicator.complete);
                        }
                    }
                }
            },
            onEnter: (globals, AnalyticsUtil) => AnalyticsUtil.trackView(globals.LANDING.CONFIG.ANALYTICS.pageName)
        });
    }

    angular.module("app.components.landing")
        .config(configureRoutes);
}());
