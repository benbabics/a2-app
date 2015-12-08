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
            }
        });
    }

    angular.module("app.components.landing")
        .config(configureRoutes);
}());
