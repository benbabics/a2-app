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
                        fetchBrandLogo: function($q, globals, BrandManager, BrandUtil) {
                            return function () {
                                var ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES,
                                    brandLogoAsset = BrandManager.getUserBrandAssetBySubtype(ASSET_SUBTYPES.BRAND_LOGO);

                                //if this brand has a logo associated with it then get its data
                                if (brandLogoAsset) {
                                    return BrandUtil.getAssetResourceData(brandLogoAsset)
                                        .catch(function () {
                                            //we couldn't get the brand logo file data, so just resolve with no logo
                                            return $q.resolve("");
                                        });
                                }
                                else {
                                    return $q.resolve("");
                                }
                            }
                        },

                        fetchCurrentInvoiceSummary: function (_, accountId, InvoiceManager) {
                            return _.partial(InvoiceManager.fetchCurrentInvoiceSummary, accountId);
                        },

                        fetchScheduledPaymentsCount: function (_, accountId, globals, PaymentManager) {
                            return _.partial(PaymentManager.fetchScheduledPaymentsCount, accountId);
                        },

                        brandLogo: function (fetchBrandLogo, LoadingIndicator, WexCache) {
                            LoadingIndicator.begin();
                            return WexCache.fetchPropertyValue("brandLogo", fetchBrandLogo)
                                .finally(LoadingIndicator.complete);
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
