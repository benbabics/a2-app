(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("payment", {
            abstract: true,
            url     : "/payment",
            template: "<ion-nav-view name='payment-view'></ion-nav-view>"
        });

        $stateProvider.state("payment.list", {
            abstract: true,
            url: "/list",
            views: {
                "payment-view": {
                    template: "<ion-nav-view></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("payment.list.view", {   // default payment.list child state
            url: "",
            templateUrl: "app/components/payment/templates/paymentList.html",
            controller : "PaymentListController as vm"
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

        $stateProvider.state("payment.input.bankAccount", {
            url: "/bankAccount",
            views: {
                "payment-view@payment": {
                    templateUrl: "app/components/payment/templates/paymentBankAccount.input.html",
                    controller: "PaymentBankAccountInputController as vm",
                    resolve: {
                        payment: function (Payment) {
                            return Payment.getPayment();
                        },

                        bankAccounts: function (CommonService, BankManager, Payment) {
                            var _ = CommonService._,
                                activeBanks = _.sortBy(BankManager.getActiveBanks(), "name"),
                                currentBankAccount = Payment.getPayment().bankAccount;

                            // If there is a bank account already selected, remove it from the list
                            // to only show different bank accounts
                            if (_.isObject(currentBankAccount)) {
                                return _.remove(activeBanks, function (bank) {
                                    return bank.id !== currentBankAccount.id;
                                });
                            }

                            return activeBanks;
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
                    controller : "PaymentDateInputController as vm",
                    resolve    : {
                        payment: function (Payment) {
                            return Payment.getPayment();
                        }
                    }
                }
            }
        });
    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
