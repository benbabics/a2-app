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
                        payment: function (CommonService, Payment) {
                            CommonService.loadingBegin();

                            return Payment.getOrCreatePaymentAdd()
                                .finally(function() {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            }
        });

        $stateProvider.state("payment.summary", {
            url: "/summary",
            cache: false,
            views: {
                "payment-view": {
                    templateUrl: "app/components/payment/templates/paymentSummary.html",
                    controller: "PaymentSummaryController as vm",
                    resolve    : {
                        payment: function (CommonService, Payment) {
                            CommonService.loadingBegin();

                            return Payment.getOrCreatePaymentAdd()
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
