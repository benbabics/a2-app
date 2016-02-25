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

                        brandLogo: function($q, globals, CommonService, BrandUtil) {
                            var ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES,
                                brandLogoAsset = BrandUtil.getUserBrandAssetBySubtype(ASSET_SUBTYPES.BRAND_LOGO);

                            //if this brand has a logo associated with it then get its data
                            if (brandLogoAsset) {
                                CommonService.loadingBegin();

                                return BrandUtil.getAssetResourceData(brandLogoAsset)
                                    .catch(function () {
                                        //we couldn't get the brand logo file data, so just resolve with no logo
                                        return $q.resolve("");
                                    })
                                    .finally(CommonService.loadingComplete);
                            }
                            else {
                                return "";
                            }
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
