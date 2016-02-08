(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("landing", {
            url: "/landing",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/landing/templates/landing.html",
                    controller: "LandingController as vm",
                    resolve    : {
                        accountId: function (UserManager) {
                            return UserManager.getUser().billingCompany.accountId;
                        },

                        brandLogo: function(globals, BrandUtil, CommonService) {
                            CommonService.loadingBegin();

                            return BrandUtil.getAssetResourceDataBySubtype(globals.BRAND.ASSET_SUBTYPES.BRAND_LOGO)
                                .finally(CommonService.loadingComplete);
                        },

                        currentInvoiceSummary: function (accountId, CommonService, InvoiceManager) {
                            CommonService.loadingBegin();

                            // Return the current invoice summary
                            return InvoiceManager.fetchCurrentInvoiceSummary(accountId)
                                .finally(function() {
                                    CommonService.loadingComplete();
                                });
                        },

                        scheduledPaymentsCount: function (accountId, globals, CommonService, PaymentManager) {
                            CommonService.loadingBegin();

                            return PaymentManager.fetchScheduledPaymentsCount(accountId)
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.LANDING.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.landing")
        .config(configureRoutes);
}());
