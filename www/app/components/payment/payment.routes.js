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
                    templateUrl: "app/components/payment/templates/makePayment.html",
                    controller: "MakePaymentController as vm"
                }
            }
        });
    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
