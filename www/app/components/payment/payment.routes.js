(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Routes above the scroll
    /* jshint -W072 */ // Not sure why, but maxparams:7 did not seem to work but this does

    var PAYMENT_ADD_ERROR_REDIRECT_STATE = "payment.list.view";

    /* @ngInject */
    function configureRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when("/payment/add/verify", validateBeforeNavigatingToPaymentAdd);

        $urlRouterProvider.when("/payment/add", function(globals, $state, $stateParams) {
            goToMaintenanceFlow(globals.PAYMENT_MAINTENANCE.STATES.ADD, $state, $stateParams);
        });

        $urlRouterProvider.when("/payment/update/:paymentId", function(globals, $state, $stateParams) {
            goToMaintenanceFlow(globals.PAYMENT_MAINTENANCE.STATES.UPDATE, $state, $stateParams);
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

        $stateProvider.state("payment.detail", {
            url        : "/detail/:paymentId",
            cache      : false,
            views: {
                "view@payment": {
                    templateUrl: "app/components/payment/templates/paymentDetail.html",
                    controller : "PaymentDetailController as vm",
                    resolve    : {
                        payment: function ($stateParams, CommonService, PaymentManager) {
                            var paymentId = $stateParams.paymentId;

                            CommonService.loadingBegin();

                            return PaymentManager.fetchPayment(paymentId)
                                .finally(function () {
                                    CommonService.loadingComplete();
                                });
                        },

                        // jshint maxparams:5
                        isPaymentEditable: function (globals, payment, CommonService, PaymentManager, UserManager) {
                            var billingAccountId = UserManager.getUser().billingCompany.accountId;

                            CommonService.loadingBegin();

                            return PaymentManager.isPaymentEditable(billingAccountId, payment)
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
            url: "/update/:paymentId"
        });

        $stateProvider.state("payment.maintenance", {
            cache   : false,
            abstract: true,
            url     : "/maintenance/:maintenanceState?paymentId",
            resolve : {
                maintenance: function (globals, $state, $stateParams) {
                    return {
                        state: $stateParams.maintenanceState,
                        states: globals.PAYMENT_MAINTENANCE.STATES,
                        go: function(stateName, params) {
                            $state.go(stateName, angular.extend({}, $stateParams, params));
                        }
                    };
                },
                // jshint maxparams:6
                payment: function ($q, $stateParams, CommonService, PaymentManager, PaymentModel, globals) {
                    var maintenanceState = $stateParams.maintenanceState,
                        payment = new PaymentModel(),
                        paymentId;

                    if (maintenanceState === globals.PAYMENT_MAINTENANCE.STATES.UPDATE) {
                        paymentId = $stateParams.paymentId;

                        CommonService.loadingBegin();

                        return PaymentManager.fetchPayment(paymentId)
                            .then(function(paymentToUpdate) {
                                payment.set(paymentToUpdate);

                                return payment;
                            })
                            .finally(CommonService.loadingComplete);
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
                        defaultBank: function (BankManager, CommonService, InvoiceManager, UserManager) {
                            var accountId = UserManager.getUser().billingCompany.accountId;

                            CommonService.loadingBegin();

                            return BankManager.getDefaultBank(accountId)
                                .finally(CommonService.loadingComplete);
                        }
                    }
                }
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
                        hasMultipleBanks: function (BankManager, CommonService, UserManager) {
                            var billingAccountId;

                            CommonService.loadingBegin();

                            billingAccountId = UserManager.getUser().billingCompany.accountId;

                            return BankManager.hasMultipleBanks(billingAccountId)
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
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceSummary.html",
                    controller : "PaymentMaintenanceSummaryController as vm"
                }
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
            }
        });

        $stateProvider.state("payment.maintenance.input.bankAccount", {
            url  : "/bankAccount",
            views: {
                "view@payment.maintenance": {
                    templateUrl: "app/components/payment/templates/paymentMaintenanceBankAccount.input.html",
                    controller : "PaymentMaintenanceBankAccountInputController as vm",
                    resolve    : {
                        bankAccounts: function (payment, BankManager, CommonService) {
                            var _ = CommonService._,
                                activeBanks = _.sortBy(BankManager.getActiveBanks(), "name"),
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
            }
        });

        function goToMaintenanceFlow(maintenanceState, $state, $stateParams) {
            $state.go("payment.maintenance.form", angular.extend({maintenanceState: maintenanceState}, $stateParams));
        }

        function validateBeforeNavigatingToPaymentAdd($cordovaGoogleAnalytics, $state, $rootScope,
                                                      globals, CommonService, Logger, PaymentManager, UserManager) {
            var _ = CommonService._,
                billingAccountId,
                removeListener,
                showRouteValidationError = function (errorMessage, trackEvent) {
                    return CommonService.displayAlert({
                        content       : errorMessage,
                        buttonCssClass: "button-submit"
                    })
                        .then(CommonService.waitForCordovaPlatform)
                        .then(_.partial(_.spread($cordovaGoogleAnalytics.trackEvent), trackEvent));
                };

            CommonService.loadingBegin();

            billingAccountId = UserManager.getUser().billingCompany.accountId;

            PaymentManager.fetchPaymentAddAvailability(billingAccountId)
                .then(function (paymentAddAvailability) {
                    var errorMessage,
                        trackEvent;

                    if (paymentAddAvailability.shouldDisplayBankAccountSetupMessage) {
                        errorMessage = globals.PAYMENT_ADD.WARNINGS.BANK_ACCOUNTS_NOT_SETUP;
                        trackEvent = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddBankAccountsNotSetup;
                    }
                    else if (paymentAddAvailability.shouldDisplayDirectDebitEnabledMessage) {
                        errorMessage = globals.PAYMENT_ADD.WARNINGS.DIRECT_DEBIT_SETUP;
                        trackEvent = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddDirectDebitSetup;
                    }
                    else if (paymentAddAvailability.shouldDisplayOutstandingPaymentMessage) {
                        errorMessage = globals.PAYMENT_ADD.WARNINGS.PAYMENT_ALREADY_SCHEDULED;
                        trackEvent = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddPaymentAlreadyScheduled;
                    }
                    else if (paymentAddAvailability.shouldDisplayCurrentBalanceDueMessage) {
                        errorMessage = globals.PAYMENT_ADD.WARNINGS.NO_BALANCE_DUE;
                        trackEvent = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events.paymentAddNoBalanceDue;
                    }

                    if (errorMessage) {
                        $state.go(PAYMENT_ADD_ERROR_REDIRECT_STATE);

                        //if already at the error redirect state then just show the alert, else finish the redirect before showing the alert
                        if ($state.current.name === PAYMENT_ADD_ERROR_REDIRECT_STATE) {
                            showRouteValidationError(errorMessage, trackEvent);
                        }
                        else {
                            removeListener = $rootScope.$on("$stateChangeSuccess", function () {
                                removeListener();

                                showRouteValidationError(errorMessage, trackEvent);
                            });
                        }
                    }
                    else {
                        // No problems we're worried about here so go to the payment add page
                        $state.go("payment.add");
                    }
                })
                .catch(function(errorResponse) {
                    //TODO - What do we do here?

                    Logger.error("Failed to determine payment add availability: " + errorResponse);

                    $state.go("payment.list.view");
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });
        }

    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
