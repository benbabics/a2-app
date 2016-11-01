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

                        //jshint maxparams:5
                        brandLogo: function($q, globals, BrandManager, BrandUtil, LoadingIndicator) {
                            var ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES,
                                brandLogoAsset = BrandManager.getUserBrandAssetBySubtype(ASSET_SUBTYPES.BRAND_LOGO);

                            //if this brand has a logo associated with it then get its data
                            if (brandLogoAsset) {
                                LoadingIndicator.begin();

                                return BrandUtil.getAssetResourceData(brandLogoAsset)
                                    .catch(function () {
                                        //we couldn't get the brand logo file data, so just resolve with no logo
                                        return $q.resolve("");
                                    })
                                    .finally(LoadingIndicator.complete);
                            }
                            else {
                                return "";
                            }
                        },

                        currentInvoiceSummary: function (accountId, InvoiceManager, LoadingIndicator) {
                            LoadingIndicator.begin();

                            // Return the current invoice summary
                            return InvoiceManager.fetchCurrentInvoiceSummary(accountId)
                                .finally(function() {
                                    LoadingIndicator.complete();
                                });
                        },

                        scheduledPaymentsCount: function (accountId, globals, PaymentManager, LoadingIndicator) {
                            LoadingIndicator.begin();

                            return PaymentManager.fetchScheduledPaymentsCount(accountId)
                                .finally(function () {
                                    LoadingIndicator.complete();
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
