(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("payment", {
            abstract: true,
            url: "/payment",
            template: "<ion-nav-view name='payment-view'></ion-nav-view>"
        });

        $stateProvider.state("payment.add", {
            url: "/add",
            cache: false,
            views: {
                "payment-view": {
                    templateUrl: "app/components/payment/templates/paymentAdd.html",
                    controller: "PaymentAddController as vm",
                    resolve    : {
                        activeBanks: function (CommonService, BankManager, UserManager) {
                            var billingAccountId;

                            CommonService.loadingBegin();

                            billingAccountId = UserManager.getUser().billingCompany.accountId;

                            // Return the collection of active banks
                            return BankManager.fetchActiveBanks(billingAccountId)
                                .finally(function() {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            }
        });
    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
