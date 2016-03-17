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
            resolve : {
                maintenanceDetails: function ($stateParams, PaymentMaintenanceDetailsModel) {
                    var maintenanceDetails = new PaymentMaintenanceDetailsModel();

                    maintenanceDetails.state = $stateParams.maintenanceState;
                    return maintenanceDetails;
                },
                // jshint maxparams:7
                payment: function ($q, $state, $stateParams, LoadingIndicator, PaymentManager, PaymentModel, globals) {
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
                                $state.go(PAYMENT_ADD_ERROR_REDIRECT_STATE);
                                return $q.resolve();

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
                        //jshint maxparams:6
                        defaultBank: function ($q, $state, BankManager, InvoiceManager, LoadingIndicator, UserManager) {
                            var accountId = UserManager.getUser().billingCompany.accountId;

                            LoadingIndicator.begin();

                            return BankManager.getDefaultBank(accountId)
                                .catch(function () {
                                    //there was an error getting the default bank, so we need to cancel
                                    $state.go(PAYMENT_ADD_ERROR_REDIRECT_STATE);
                                    return $q.resolve();

                                    //TODO: Show the user an error if this happens?
                                })
                                .finally(LoadingIndicator.complete);
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
            onEnter: function(globals, maintenanceDetails, AnalyticsUtil) {
                AnalyticsUtil.trackView(maintenanceDetails.getConfig(globals.PAYMENT_MAINTENANCE_FORM).ANALYTICS.pageName);
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
            onEnter: function(globals, maintenanceDetails, AnalyticsUtil) {
                AnalyticsUtil.trackView(maintenanceDetails.getConfig(globals.PAYMENT_MAINTENANCE_SUMMARY).ANALYTICS.pageName);
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
            onEnter: function(globals, maintenanceDetails, AnalyticsUtil) {
                AnalyticsUtil.trackView(maintenanceDetails.getConfig(globals.PAYMENT_MAINTENANCE_CONFIRMATION).ANALYTICS.pageName);
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
            onEnter: function(globals, maintenanceDetails, AnalyticsUtil) {
                AnalyticsUtil.trackView(maintenanceDetails.getConfig(globals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT).ANALYTICS.pageName);
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
            onEnter: function(globals, maintenanceDetails, AnalyticsUtil) {
                AnalyticsUtil.trackView(maintenanceDetails.getConfig(globals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT).ANALYTICS.pageName);
            }
        });

        function goToMaintenanceFlow(maintenanceState, $state, $stateParams) {
            $state.go("payment.maintenance.form", angular.extend({maintenanceState: maintenanceState}, $stateParams));
        }

        function validateBeforeNavigatingToPaymentAdd(_, $state, $rootScope, globals, AnalyticsUtil,
                                                      LoadingIndicator, Logger, PaymentManager, PopupUtil, UserManager) {
            var WARNINGS = globals.PAYMENT_ADD.WARNINGS,
                ANALYTICS_EVENTS = globals.PAYMENT_LIST.CONFIG.ANALYTICS.events,
                billingAccountId,
                removeListener,
                showRouteValidationError = function (errorMessage, trackEvent) {
                    return PopupUtil.displayAlert({
                        content       : errorMessage,
                        buttonCssClass: "button-submit"
                    })
                        .then(_.partial(_.spread(AnalyticsUtil.trackEvent), trackEvent));
                };

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
                    LoadingIndicator.complete();
                });
        }

    }

    angular.module("app.components.payment")
        .config(configureRoutes);
}());
