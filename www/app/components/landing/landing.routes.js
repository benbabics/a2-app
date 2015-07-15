(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("landing", {
            url: "/landing",
            views: {
                "@": {
                    templateUrl: "app/components/landing/templates/landing.html",
                    controller: "LandingController as vm",
                    resolve    : {
                        currentInvoiceSummary: function (CommonService, InvoiceManager, UserManager) {
                            var billingAccountId;

                            CommonService.loadingBegin();

                            billingAccountId = UserManager.getUser().billingCompany.accountId;

                            // Return the current invoice summary
                            return InvoiceManager.retrieveCurrentInvoiceSummary(billingAccountId)
                                .finally(function() {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            }
        });
    }

    angular.module("app.components.landing")
        .config(configureRoutes);
}());
