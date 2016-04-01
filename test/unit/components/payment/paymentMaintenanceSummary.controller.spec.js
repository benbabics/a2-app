(function () {
    "use strict";

    var _,
        $q,
        $scope,
        $state,
        $ionicHistory,
        ctrl,
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

    describe("A Payment Maintenance Summary Controller", function () {

        beforeEach(function () {

            // mock dependencies
            $state = jasmine.createSpyObj("state", ["go"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["nextViewOptions"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["addPayment", "updatePayment"]);
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
                "getStates"
            ]);

            module("app.shared");
            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));

                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("$state", $state);
                $provide.value("$ionicHistory", $ionicHistory);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (___, $controller, _$q_, $rootScope, _moment_, _BankModel_, appGlobals,
                             _PaymentModel_, _PaymentMaintenanceUtil_) {

                _ = ___;
                $q = _$q_;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;

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
                MockPaymentMaintenanceUtil.getActiveState.and.returnValue(maintenanceState);

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

            var processPaymentDeferred,
                mockPaymentProcessFunction;

            beforeEach(function () {
                processPaymentDeferred = $q.defer();
                mockPaymentProcessFunction = getPaymentProcessFunction();

                mockPaymentProcessFunction.and.returnValue(processPaymentDeferred.promise);

                spyOn(mockPaymentProcess, "set").and.callThrough();

                ctrl.payment = mockPaymentProcess;

                ctrl.processPayment();
            });

            it("should process the Payment", function () {
                expect(mockPaymentProcessFunction).toHaveBeenCalledWith(mockUser.billingCompany.accountId, mockPaymentProcess);
            });

            describe("when the Payment is processed successfully", function () {

                beforeEach(function () {
                    //resolve the process payment promise
                    processPaymentDeferred.resolve(mockPayment);

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

            describe("when the Payment is NOT processed successfully", function () {

                var errorObjectArg = new Error("Processing payment failed");

                beforeEach(function () {
                    //reject with an error message
                    processPaymentDeferred.reject(errorObjectArg);

                    $scope.$digest();
                });

                it("should NOT set the payment", function () {
                    expect(mockPaymentProcess.set).not.toHaveBeenCalled();
                });

                it("should NOT navigate away from the current page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

            });

        });

        function getPaymentProcessFunction() {
            if (PaymentMaintenanceUtil.isAddState(maintenanceState)) {
                return PaymentManager.addPayment;
            }
            else if (PaymentMaintenanceUtil.isUpdateState(maintenanceState)) {
                return PaymentManager.updatePayment;
            }
            else {
                return null;
            }
        }

    });

}());
