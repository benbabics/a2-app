(function () {
    "use strict";

    var _,
        $q,
        $scope,
        $state,
        $ionicHistory,
        ctrl,
        mockMaintenanceState,
        mockStateParams,
        mockMaintenance,
        mockGlobals = {
            PAYMENT_MAINTENANCE_SUMMARY: {
                "CONFIG"  : {
                    "title"                : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "afternoonWarning"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "weekendHolidayWarning": TestUtils.getRandomStringThatIsAlphaNumeric(10),
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
                    "CONFIG": {}
                },
                "UPDATE"  : {
                    "CONFIG": {}
                }
            }
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
        PaymentMaintenance,
        PaymentManager,
        PaymentModel,
        UserManager;

    describe("A Payment Maintenance Summary Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components");

            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            $state = jasmine.createSpyObj("state", ["go"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["nextViewOptions"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            PaymentMaintenance = jasmine.createSpyObj("PaymentMaintenance", ["getPayment"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["addPayment", "updatePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function ($controller, _$q_, $rootScope, _moment_, _BankModel_, appGlobals, CommonService, _PaymentModel_) {

                _ = CommonService._;
                $q = _$q_;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockMaintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);
                mockStateParams = {
                    maintenanceState: mockMaintenanceState
                };
                mockMaintenance = {
                    state : mockMaintenanceState,
                    states: appGlobals.PAYMENT_MAINTENANCE.STATES,
                    go    : jasmine.createSpy("go")
                };

                ctrl = $controller("PaymentMaintenanceSummaryController", {
                    $scope            : $scope,
                    $state            : $state,
                    $stateParams      : mockStateParams,
                    $ionicHistory     : $ionicHistory,
                    maintenance       : mockMaintenance,
                    InvoiceManager    : InvoiceManager,
                    PaymentMaintenance: PaymentMaintenance,
                    PaymentManager    : PaymentManager,
                    UserManager       : UserManager
                });

            });

            switch(mockMaintenance.state) {
                case mockMaintenance.states.ADD:
                    mockPaymentProcess = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);
                    break;
                case mockMaintenance.states.UPDATE:
                    mockPaymentProcess = TestUtils.getRandomPaymentUpdate(PaymentModel, BankModel);
                    break;
                default:
                    mockPaymentProcess = null;
                    break;
            }

            mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            PaymentMaintenance.getPayment.and.returnValue(mockPaymentProcess);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend({},
                mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.CONFIG,
                getConfig(mockMaintenance)
            ));
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
                mockPaymentProcessFunction = getPaymentProcessFunction(mockMaintenance, PaymentManager);

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
                    expect(mockMaintenance.go).toHaveBeenCalledWith("payment.maintenance.confirmation");
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

    });

    function getConfig(maintenance) {
        switch (maintenance.state) {
            case maintenance.states.ADD:
                return mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.ADD.CONFIG;
            case maintenance.states.UPDATE:
                return mockGlobals.PAYMENT_MAINTENANCE_SUMMARY.UPDATE.CONFIG;
            default:
                return null;
        }
    }

    function getPaymentProcessFunction(maintenance, PaymentManager) {
        switch (maintenance.state) {
            case maintenance.states.ADD:
                return PaymentManager.addPayment;
            case maintenance.states.UPDATE:
                return PaymentManager.updatePayment;
            default:
                return null;
        }
    }

}());