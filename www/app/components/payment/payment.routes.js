(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Routes above the scroll
    /* jshint -W072 */ // Not sure why, but maxparams:7 did not seem to work but this does

    /* @ngInject */
    function configureRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when("/payment/add/verify", validateBeforeNavigatingToPaymentAdd);

        $urlRouterProvider.when("/payment/add", function(globals, $state, $stateParams, PaymentMaintenanceUtil) {
            PaymentMaintenanceUtil.go("payment.maintenance.form", $stateParams, globals.PAYMENT_MAINTENANCE.STATES.ADD);
        });

        $urlRouterProvider.when("/payment/update/:paymentId", function(globals, $state, $stateParams, PaymentMaintenanceUtil) {
            PaymentMaintenanceUtil.go("payment.maintenance.form", $stateParams, globals.PAYMENT_MAINTENANCE.STATES.UPDATE);
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
            cache      : true,
            templateUrl: "app/components/payment/templates/paymentList.html",
            controller : "PaymentListController as vm",
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.PAYMENT_LIST.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("payment.detail", {
            url        : "/detail/:paymentId",
            cache      : false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentDetail.html",
                    controller : "PaymentDetailController as vm",
                    resolve    : {
                        payment: function ($stateParams, LoadingIndicator, PaymentManager) {
                            var paymentId = $stateParams.paymentId;

                            LoadingIndicator.begin();

                            return PaymentManager.fetchPayment(paymentId)
                                .finally(function () {
                                    LoadingIndicator.complete();
                                });
                        },

                        // jshint maxparams:5
                        isPaymentEditable: function (globals, payment, LoadingIndicator, PaymentManager, UserManager) {
                            var billingAccountId = UserManager.getUser().billingCompany.accountId;

                            LoadingIndicator.begin();

                            return PaymentManager.isPaymentEditable(billingAccountId, payment)
                                .finally(function () {
                                    LoadingIndicator.complete();
                                });
                        }
                    }
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.PAYMENT_VIEW.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("payment.add", {
            url: "/add"
        });

        $stateProvider.state("payment.update", {
            url: "/update/:paymentId"
        });

        $stateProvider.state("payment.maintenance", {
            cache   : false,
            abstract: true,
            url     : "/maintenance/:maintenanceState?paymentId",
            data    : {
                maintenanceState: ""
            },
            resolve : {
                // jshint maxparams:7
                payment: function ($q, $stateParams, LoadingIndicator, Navigation, PaymentManager, PaymentModel, globals) {
                    var maintenanceState = $stateParams.maintenanceState,
                        payment = new PaymentModel(),
                        paymentId;

                    if (maintenanceState === globals.PAYMENT_MAINTENANCE.STATES.UPDATE) {
                        paymentId = $stateParams.paymentId;

                        LoadingIndicator.begin();

                        return PaymentManager.fetchPayment(paymentId)
                            .then(function(paymentToUpdate) {
                                payment.set(paymentToUpdate);

                                return payment;
                            })
                            .catch(function () {
                                //there was an error fetching the payment, so we need to cancel
                                return Navigation.goToPaymentActivity();

                                //TODO: Show the user an error if this happens?
                            })
                            .finally(LoadingIndicator.complete);
                    }
                    else {
                        return $q.when(payment);
                    }
                }
            },
            views   : {
                "view@payment": {
                    template   : "<ion-nav-view name='view'></ion-nav-view>",
                    controller : "PaymentMaintenanceController as maintenanceController",
                    resolve    : {
                        //jshint maxparams:5
                        defaultBank: function (BankManager, InvoiceManager, LoadingIndicator, Navigation, UserManager) {
                            var accountId = UserManager.getUser().billingCompany.accountId;

                            LoadingIndicator.begin();

                            return BankManager.getDefaultBank(accountId)
                                .catch(function () {
                                    //there was an error getting the default bank, so we need to cancel
                                    return Navigation.goToPaymentActivity();

                                    //TODO: Show the user an error if this happens?
                                })
                                .finally(LoadingIndicator.complete);
                        }
                    }
                }
            },
            onEnter: function($stateParams) {
                this.data.maintenanceState = $stateParams.maintenanceState;
            }
        });

        $stateProvider.state("payment.maintenance.form", {
            url  : "/form",
            cache: false,
            views: {
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceForm.html",
                    controller : "PaymentMaintenanceFormController as vm",
                    resolve    : {
                        hasMultipleBanks: function (BankManager, LoadingIndicator, UserManager) {
                            var billingAccountId;

                            LoadingIndicator.begin();

                            billingAccountId = UserManager.getUser().billingCompany.accountId;

                            return BankManager.hasMultipleBanks(billingAccountId)
                                .finally(function () {
                                    LoadingIndicator.complete();
                                });
                        }
                    }
                }
            },
            onEnter: function(globals, PaymentMaintenanceUtil, AnalyticsUtil) {
                var config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_FORM, this.data.maintenanceState);

                AnalyticsUtil.trackView(config.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("payment.maintenance.summary", {
            url  : "/summary",
            cache: false,
            views: {
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceSummary.html",
                    controller : "PaymentMaintenanceSummaryController as vm"
                }
            },
            onEnter: function(globals, PaymentMaintenanceUtil, AnalyticsUtil) {
                var config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_SUMMARY, this.data.maintenanceState);

                AnalyticsUtil.trackView(config.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("payment.maintenance.confirmation", {
            url  : "/confirmation",
            cache: false,
            views: {
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceConfirmation.html",
                    controller : "PaymentMaintenanceConfirmationController as vm"
                }
            },
            onEnter: function(globals, PaymentMaintenanceUtil, AnalyticsUtil) {
                var config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_CONFIRMATION, this.data.maintenanceState);

                AnalyticsUtil.trackView(config.ANALYTICS.pageName);
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
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceAmount.input.html",
                    controller : "PaymentMaintenanceAmountInputController as vm",
                    resolve    : {
                        invoiceSummary: function (InvoiceManager) {
                            return InvoiceManager.getInvoiceSummary();
                        }
                    }
                }
            },
            onEnter: function(globals, PaymentMaintenanceUtil, AnalyticsUtil) {
                var config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT, this.data.maintenanceState);

                AnalyticsUtil.trackView(config.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("payment.maintenance.input.bankAccount", {
            url  : "/bankAccount",
            views: {
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceBankAccount.input.html",
                    controller : "PaymentMaintenanceBankAccountInputController as vm",
                    resolve    : {
                        bankAccounts: function (_, payment, BankManager) {
                            var activeBanks = _.sortBy(BankManager.getActiveBanks(), "name"),
                                currentBankAccount = payment.bankAccount;

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
            },
            onEnter: function(globals, PaymentMaintenanceUtil, AnalyticsUtil) {
                var config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT, this.data.maintenanceState);

                AnalyticsUtil.trackView(config.ANALYTICS.pageName);
            }
        });

        function validateBeforeNavigatingToPaymentAdd($state, globals, LoadingIndicator, Logger,
                                                      Navigation, PaymentMaintenanceUtil, PaymentManager, UserManager) {
            var WARNINGS = globals.PAYMENT_ADD.WARNINGS,
                ANALYTICS_EVENTS = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events,
                billingAccountId;

            LoadingIndicator.begin();

            billingAccountId = UserManager.getUser().billingCompany.accountId;

            PaymentManager.fetchPaymentAddAvailability(billingAccountId)
                .then(function (paymentAddAvailability) {
                    var errorMessage,
                        trackEvent;

                    if (paymentAddAvailability.shouldDisplayBankAccountSetupMessage) {
                        errorMessage = WARNINGS.BANK_ACCOUNTS_NOT_SETUP;
                        trackEvent = ANALYTICS_EVENTS.paymentAddBankAccountsNotSetup;
                    }
                    else if (paymentAddAvailability.shouldDisplayDirectDebitEnabledMessage) {
                        errorMessage = WARNINGS.DIRECT_DEBIT_SETUP;
                        trackEvent = ANALYTICS_EVENTS.paymentAddDirectDebitSetup;
                    }
                    else if (paymentAddAvailability.shouldDisplayOutstandingPaymentMessage) {
                        errorMessage = WARNINGS.PAYMENT_ALREADY_SCHEDULED;
                        trackEvent = ANALYTICS_EVENTS.paymentAddPaymentAlreadyScheduled;
                    }
                    else if (paymentAddAvailability.shouldDisplayCurrentBalanceDueMessage) {
                        errorMessage = WARNINGS.NO_BALANCE_DUE;
                        trackEvent = ANALYTICS_EVENTS.paymentAddNoBalanceDue;
                    }

                    if (errorMessage) {
                        //TODO - Figure out how to display the error popup after the payment list has been fetched so the loading indicator doesn't overlap it
                        PaymentMaintenanceUtil.showPaymentError(errorMessage, trackEvent);
                    }
                    else {
                        // No problems we're worried about here so go to the payment add page
                        $state.go("payment.add");
                    }
                })
                .catch(function(errorResponse) {
                    //TODO - What do we do here?

                    Logger.error("Failed to determine payment add availability: " + errorResponse);

                    Navigation.goToPaymentActivity();
                })
                .finally(function () {
                    LoadingIndicator.complete();
                });
        }

    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
