(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("payment", {
            abstract: true,
            url     : "/payment",
            template: "<ion-nav-view name='payment-view'></ion-nav-view>"
        });

        $stateProvider.state("payment.add", {
            url  : "/add",
            cache: false,
            views: {
                "payment-view": {
                    templateUrl: "app/components/payment/templates/paymentAdd.html",
                    controller : "PaymentAddController as vm",
                    resolve    : {
                        payment: function (CommonService, Payment) {
                            CommonService.loadingBegin();

                            return Payment.getOrCreatePaymentAdd()
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            }
        });

        $stateProvider.state("payment.summary", {
            url  : "/summary",
            cache: false,
            views: {
                "payment-view": {
                    templateUrl: "app/components/payment/templates/paymentSummary.html",
                    controller : "PaymentSummaryController as vm"
                }
            }
        });

        $stateProvider.state("payment.confirmation", {
            url  : "/confirmation",
            cache: false,
            views: {
                "payment-view": {
                    templateUrl: "app/components/payment/templates/paymentConfirmation.html",
                    controller : "PaymentConfirmationController as vm"
                }
            }
        });

        $stateProvider.state("payment.input", {
            abstract: true,
            url     : "/input",
            cache   : false
        });

        $stateProvider.state("payment.input.amount", {
            url  : "/amount",
            views: {
                "payment-view@payment": {
                    templateUrl: "app/components/payment/templates/paymentAmount.input.html",
                    controller : "PaymentAmountInputController as vm",
                    resolve    : {
                        payment: function (Payment) {
                            return Payment.getPayment();
                        },

                        invoiceSummary: function (InvoiceManager) {
                            return InvoiceManager.getInvoiceSummary();
                        }
                    }
                }
            }
        });

        $stateProvider.state("payment.input.date", {
            url  : "/date",
            views: {
                "payment-view@payment": {
                    templateUrl: "app/components/payment/templates/paymentDate.input.html",
                    controller : "PaymentDateInputController as vm"
                }
            }
        });
    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
