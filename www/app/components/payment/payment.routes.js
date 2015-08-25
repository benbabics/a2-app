(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when("/payment/add", function(globals, $state) {
            goToMaintenanceState($state, "payment.maintenance.form", globals.PAYMENT_MAINTENANCE.STATES.ADD);
        });

        $urlRouterProvider.when("/payment/update", function(globals, $state) {
            goToMaintenanceState($state, "payment.maintenance.form", globals.PAYMENT_MAINTENANCE.STATES.UPDATE);
        });

        $stateProvider.state("payment", {
            abstract: true,
            url     : "/payment",
            template: "<ion-nav-view name='view'></ion-nav-view>"
        });

        $stateProvider.state("payment.list", {
            abstract: true,
            url     : "/list",
            views   : {
                "view@payment": {
                    template: "<ion-nav-view></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("payment.list.view", {   // default payment.list child state
            url        : "",
            cache      : false,
            templateUrl: "app/components/payment/templates/paymentList.html",
            controller : "PaymentListController as vm",
            resolve    : {
                payments: function (globals, CommonService, PaymentManager, UserManager) {
                    var billingAccountId = UserManager.getUser().billingCompany.accountId,
                        options = globals.PAYMENT_LIST.SEARCH_OPTIONS;

                    CommonService.loadingBegin();

                    return PaymentManager.fetchPayments(billingAccountId, options.PAGE_NUMBER, options.PAGE_SIZE)
                        .finally(function () {
                            CommonService.loadingComplete();
                        });
                }
            }
        });

        $stateProvider.state("payment.view", {
            url        : "/view/:paymentId",
            cache      : false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentView.html",
                    controller : "PaymentViewController as vm",
                    resolve    : {
                        payment: function ($stateParams, CommonService, PaymentManager) {
                            var paymentId = $stateParams.paymentId;

                            CommonService.loadingBegin();

                            return PaymentManager.fetchPayment(paymentId)
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        },

                        scheduledPaymentsCount: function (globals, CommonService, PaymentManager, UserManager) {
                            var billingAccountId = UserManager.getUser().billingCompany.accountId;

                            CommonService.loadingBegin();

                            return PaymentManager.fetchScheduledPaymentsCount(billingAccountId)
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        }
                    }
                }
            }
        });

        $stateProvider.state("payment.add", {
            url: "/add"
        });

        $stateProvider.state("payment.update", {
            url: "/update"
        });

        $stateProvider.state("payment.maintenance", {
            abstract: true,
            url: "/maintenance/:maintenanceState",
            resolve: {
                maintenance: function (globals, $state, $stateParams) {
                    return {
                        state: $stateParams.maintenanceState,
                        states: globals.PAYMENT_MAINTENANCE.STATES,
                        go: function(stateName, params) {
                            goToMaintenanceState($state, stateName, $stateParams.maintenanceState, params);
                        }
                    };
                }
            }
        });

        $stateProvider.state("payment.maintenance.form", {
            url  : "/form",
            cache: false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceForm.html",
                    controller : "PaymentMaintenanceFormController as vm",
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

        $stateProvider.state("payment.maintenance.summary", {
            url  : "/summary",
            cache: false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceSummary.html",
                    controller : "PaymentMaintenanceSummaryController as vm"
                }
            }
        });

        $stateProvider.state("payment.maintenance.confirmation", {
            url  : "/confirmation",
            cache: false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceConfirmation.html",
                    controller : "PaymentMaintenanceConfirmationController as vm"
                }
            }
        });

        $stateProvider.state("payment.maintenance.input", {
            abstract: true,
            url     : "/input",
            cache   : false
        });

        $stateProvider.state("payment.maintenance.input.amount", {
            url  : "/amount",
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceAmount.input.html",
                    controller : "PaymentMaintenanceAmountInputController as vm",
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

        $stateProvider.state("payment.maintenance.input.bankAccount", {
            url  : "/bankAccount",
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceBankAccount.input.html",
                    controller : "PaymentMaintenanceBankAccountInputController as vm",
                    resolve    : {
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

        function goToMaintenanceState($state, stateName, maintenanceState, params) {
            params = params || {};

            $state.go(stateName, angular.extend({}, { maintenanceState: maintenanceState }, params));
        }
    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
