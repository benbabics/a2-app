(function () {
    "use strict";

    var _,
        $q,
        $scope,
        $state,
        $ionicHistory,
        appGlobals,
        ctrl,
        PaymentAddAvailabilityModel,
        PaymentMaintenanceUtil,
        MockPaymentMaintenanceUtil,
        maintenanceState,
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
            PAYMENT_MAINTENANCE_SUMMARY: {
                "CONFIG"  : {
                    "title"                : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "processingWarning"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "amount"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "bankAccount"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "scheduledDate"        : TestUtils.getRandomDate(),
                    "cancelButton"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "submitButton"         : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "WARNINGS": {
                    "PAYMENT_AMOUNT_LESS_THAN_MINIMUM": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "PAYMENT_DATE_PAST_DUE_DATE"      : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "ADD"     : {
                    "CONFIG": {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },
                "UPDATE"  : {
                    "CONFIG": {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            },
            PAYMENT_MAINTENANCE: {
                "WARNINGS": {
                    "DEFAULT": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "PAYMENT_ALREADY_SCHEDULED": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            },
            LOGIN_STATE: TestUtils.getRandomStringThatIsAlphaNumeric(10)

        },
        mockCurrentInvoiceSummary = {
            accountNumber     : "account number value",
            availableCredit   : "available credit value",
            closingDate       : "closing date value",
            currentBalance    : "current balance value",
            currentBalanceAsOf: "current balance as of value",
            invoiceId         : "invoice id value",
            invoiceNumber     : "invoice number value",
            minimumPaymentDue : 150.00,
            paymentDueDate    : "2015-05-26"
        },
        mockPayment,
        mockPaymentProcess,
        mockUser = {
            email         : "email address value",
            firstName     : "first name value",
            username      : "username value",
            company       : {
                accountId    : "company account id value",
                accountNumber: "company account number value",
                name         : "company name value"
            },
            billingCompany: {
                accountId    : "billing company account id value",
                accountNumber: "billing company account number value",
                name         : "billing company name value"
            }
        },
        moment,
        BankModel,
        InvoiceManager,
        PaymentManager,
        PaymentModel,
        UserManager,
        AnalyticsUtil;

    fdescribe("A Payment Maintenance Summary Controller", function () {

        beforeEach(function () {

            // mock dependencies
            $state = jasmine.createSpyObj("state", ["go"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["nextViewOptions"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["addPayment", "fetchScheduledPaymentsCount", "updatePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            MockPaymentMaintenanceUtil = jasmine.createSpyObj("PaymentMaintenanceUtil", [
                "getConfig",
                "go",
                "getActiveState",
                "getStates",
                "showPaymentError"
            ]);

            module("app.shared");
            module("app.components", function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("$state", $state);
                $provide.value("$ionicHistory", $ionicHistory);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (___, $controller, _$q_, $rootScope, _appGlobals_, _moment_, _BankModel_,
                             _PaymentModel_, _PaymentAddAvailabilityModel_, _PaymentMaintenanceUtil_) {

                _ = ___;
                $q = _$q_;
                appGlobals = _appGlobals_;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;
                PaymentAddAvailabilityModel = _PaymentAddAvailabilityModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                if (PaymentMaintenanceUtil.isAddState(maintenanceState)) {
                    mockPaymentProcess = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);
                }
                else if (PaymentMaintenanceUtil.isUpdateState(maintenanceState)) {
                    mockPaymentProcess = TestUtils.getRandomPaymentUpdate(PaymentModel, BankModel);
                }
                else {
                    mockPaymentProcess = null;
                }

                //mock calls to PaymentMaintenanceUtil to pass the maintenanceState explicitly
                MockPaymentMaintenanceUtil.getConfig.and.callFake(function (constants) {
                    return PaymentMaintenanceUtil.getConfig(constants, maintenanceState);
                });

                MockPaymentMaintenanceUtil.getStates.and.returnValue(appGlobals.PAYMENT_MAINTENANCE.STATES);
                MockPaymentMaintenanceUtil.getActiveState.and.callFake(function () {
                    return maintenanceState;
                });

                ctrl = $controller("PaymentMaintenanceSummaryController", {
                    $scope                : $scope,
                    $state                : $state,
                    $ionicHistory         : $ionicHistory,
                    InvoiceManager        : InvoiceManager,
                    PaymentMaintenanceUtil: MockPaymentMaintenanceUtil,
                    PaymentManager        : PaymentManager,
                    UserManager           : UserManager,
                    payment               : mockPaymentProcess,
                    globals               : mockGlobals
                });

            });

            //setup spies:
            mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY, maintenanceState));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            it("should set the payment", function () {
                $scope.$broadcast("$ionicView.beforeEnter");

                expect(ctrl.payment).toEqual(mockPaymentProcess);
            });

            describe("when payment details meet expectations", function () {

                beforeEach(function () {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentProcess.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = mockPaymentProcess.scheduledDate;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when payment details exceed expectations", function () {

                beforeEach(function () {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentProcess.amount - 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentProcess.scheduledDate).add(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should NOT have any warnings", function () {
                    expect(ctrl.warnings.length).toEqual(0);
                });

            });

            describe("when the payment amount is less than the minimum amount due", function () {

                beforeEach(function () {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentProcess.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentProcess.scheduledDate);

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment amount warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.WARNINGS.PAYMENT_AMOUNT_LESS_THAN_MINIMUM);
                });

            });

            describe("when the payment date is after than the payment due date", function () {

                beforeEach(function () {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentProcess.amount;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentProcess.scheduledDate).subtract(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should only have a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(1);
                    expect(ctrl.warnings[0]).toEqual(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.WARNINGS.PAYMENT_DATE_PAST_DUE_DATE);
                });

            });

            describe("when both warnings should be found", function () {

                beforeEach(function () {
                    mockCurrentInvoiceSummary.minimumPaymentDue = mockPaymentProcess.amount + 0.01;
                    mockCurrentInvoiceSummary.paymentDueDate = moment(mockPaymentProcess.scheduledDate).subtract(1, "day");

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should have a payment amount warning and a payment date warning", function () {
                    expect(ctrl.warnings.length).toEqual(2);
                    expect(ctrl.warnings[0]).toEqual(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.WARNINGS.PAYMENT_AMOUNT_LESS_THAN_MINIMUM);
                    expect(ctrl.warnings[1]).toEqual(mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.WARNINGS.PAYMENT_DATE_PAST_DUE_DATE);
                });

            });
        });

        describe("has a processPayment function that", function () {

            beforeEach(function () {
                spyOn(mockPaymentProcess, "set").and.callThrough();

                ctrl.payment = mockPaymentProcess;
            });

            describe("when the maintenance state is ADD", function () {
                var addPaymentDeferred;

                beforeEach(function () {
                    maintenanceState = appGlobals.PAYMENT_MAINTENANCE.STATES.ADD;
                    addPaymentDeferred = $q.defer();

                    PaymentManager.addPayment.and.returnValue(addPaymentDeferred.promise);

                    ctrl.processPayment();
                });

                it("should add the Payment", function () {
                    expect(PaymentManager.addPayment).toHaveBeenCalledWith(mockUser.billingCompany.accountId, mockPaymentProcess);
                });

                describe("when the Payment is added successfully", function () {

                    beforeEach(function () {
                        //resolve the process payment promise
                        addPaymentDeferred.resolve(mockPayment);

                        $scope.$digest();
                    });

                    it("should set the payment", function () {
                        expect(mockPaymentProcess.set).toHaveBeenCalledWith(mockPayment);
                    });

                    it("should disable the back button for the confirmation page", function () {
                        expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                    });

                    it("should navigate to the payment maintenance confirmation page", function () {
                        expect(MockPaymentMaintenanceUtil.go).toHaveBeenCalledWith("payment.maintenance.confirmation");
                    });

                });

                describe("when the Payment is NOT added successfully", function () {
                    var fetchScheduledPaymentsCountDeferred,
                        error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        fetchScheduledPaymentsCountDeferred = $q.defer();

                        PaymentManager.fetchScheduledPaymentsCount.and.returnValue(fetchScheduledPaymentsCountDeferred.promise);
                        addPaymentDeferred.reject(error);
                        $scope.$digest();
                    });

                    it("should call PaymentManager.fetchScheduledPaymentsCount", function () {
                        expect(PaymentManager.fetchScheduledPaymentsCount).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                    });

                    describe("when PaymentManager.fetchScheduledPaymentsCount succeeds", function () {
                        var scheduledPaymentsCount;

                        describe("when a payment has already been scheduled", function () {

                            beforeEach(function () {
                                scheduledPaymentsCount = 1;

                                fetchScheduledPaymentsCountDeferred.resolve(scheduledPaymentsCount);
                                $scope.$digest();
                            });

                            it("should NOT set the payment", function () {
                                expect(mockPaymentProcess.set).not.toHaveBeenCalled();
                            });

                            it("should call PaymentMaintenanceUtil.showPaymentError with the expected message", function () {
                                expect(MockPaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                                    mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.PAYMENT_ALREADY_SCHEDULED
                                );
                            });
                        });

                        describe("when a payment has NOT already been scheduled", function () {

                            beforeEach(function () {
                                scheduledPaymentsCount = 0;

                                fetchScheduledPaymentsCountDeferred.resolve(scheduledPaymentsCount);
                                $scope.$digest();
                            });

                            it("should NOT set the payment", function () {
                                expect(mockPaymentProcess.set).not.toHaveBeenCalled();
                            });

                            it("should call PaymentMaintenanceUtil.showPaymentError with the expected message", function () {
                                expect(MockPaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                                    mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.DEFAULT
                                );
                            });
                        });
                    });

                    describe("when PaymentManager.fetchScheduledPaymentsCount fails", function () {
                        var error;

                        beforeEach(function () {
                            error = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                            fetchScheduledPaymentsCountDeferred.reject(error);
                            $scope.$digest();
                        });

                        it("should NOT set the payment", function () {
                            expect(mockPaymentProcess.set).not.toHaveBeenCalled();
                        });

                        it("should call PaymentMaintenanceUtil.showPaymentError with the expected message", function () {
                            expect(MockPaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(
                                mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.DEFAULT
                            );
                        });
                    });
                });
            });

            describe("when the maintenance state is UPDATE", function () {
                var updatePaymentDeferred;

                beforeEach(function () {
                    maintenanceState = appGlobals.PAYMENT_MAINTENANCE.STATES.UPDATE;
                    updatePaymentDeferred = $q.defer();

                    PaymentManager.updatePayment.and.returnValue(updatePaymentDeferred.promise);

                    ctrl.processPayment();
                });

                it("should update the Payment", function () {
                    expect(PaymentManager.updatePayment).toHaveBeenCalledWith(mockUser.billingCompany.accountId, mockPaymentProcess);
                });

                describe("when the Payment is updated successfully", function () {

                    beforeEach(function () {
                        //resolve the process payment promise
                        updatePaymentDeferred.resolve(mockPayment);

                        $scope.$digest();
                    });

                    it("should set the payment", function () {
                        expect(mockPaymentProcess.set).toHaveBeenCalledWith(mockPayment);
                    });

                    it("should disable the back button for the confirmation page", function () {
                        expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                    });

                    it("should navigate to the payment maintenance confirmation page", function () {
                        expect(MockPaymentMaintenanceUtil.go).toHaveBeenCalledWith("payment.maintenance.confirmation");
                    });

                });

                describe("when the Payment is NOT updated successfully", function () {

                    var errorObjectArg = new Error("Processing payment failed");

                    beforeEach(function () {
                        //reject with an error message
                        updatePaymentDeferred.reject(errorObjectArg);

                        $scope.$digest();
                    });

                    it("should NOT set the payment", function () {
                        expect(mockPaymentProcess.set).not.toHaveBeenCalled();
                    });

                    it("should call PaymentMaintenanceUtil.showPaymentError with the expected values", function () {
                        expect(MockPaymentMaintenanceUtil.showPaymentError).toHaveBeenCalledWith(mockGlobals.PAYMENT_MAINTENANCE.WARNINGS.DEFAULT);
                    });

                });
            });

        });

    });

}());
