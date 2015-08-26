(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        BankManager,
        BankModel,
        InvoiceManager,
        mockMaintenanceState,
        mockStateParams,
        mockMaintenance,
        mockGlobals = {
            PAYMENT_MAINTENANCE_FORM: {
                "CONFIG": {
                    "invoiceNumber" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "paymentDueDate": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "currentBalance": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "minimumPayment": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "enterAmount"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "amount"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "bankAccount"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "scheduledDate" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "submitButton"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "INPUTS": {
                    "DATE": {
                        "CONFIG": {
                            "title"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "maxFutureDays": TestUtils.getRandomInteger(1, 365)
                        }
                    }
                },
                "ADD"   : {
                    "CONFIG": {
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },
                "UPDATE": {
                    "CONFIG": {
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockHasMultipleBanks = TestUtils.getRandomBoolean(),
        mockPayment = {
            amount       : "amount value",
            bankAccount  : "bank account value",
            scheduledDate: "payment date value"
        },
        mockCurrentInvoiceSummary = {
            accountNumber     : "account number value",
            availableCredit   : "available credit value",
            closingDate       : "closing date value",
            currentBalance    : "current balance value",
            currentBalanceAsOf: "current balance as of value",
            invoiceId         : "invoice id value",
            invoiceNumber     : "invoice number value",
            minimumPaymentDue : "minimum payment due value",
            paymentDueDate    : "payment due date value"
        },
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
        UserManager;

    describe("A Payment Maintenance Form Controller", function () {

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
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            module(function ($provide) {
                $provide.value("BankManager", BankManager);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function ($controller, $rootScope, _moment_, _BankModel_, appGlobals, CommonService) {

                _ = CommonService._;
                moment = _moment_;
                BankModel = _BankModel_;

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

                ctrl = $controller("PaymentMaintenanceFormController", {
                    $scope          : $scope,
                    $stateParams    : mockStateParams,
                    hasMultipleBanks: mockHasMultipleBanks,
                    maintenance     : mockMaintenance,
                    payment         : mockPayment,
                    InvoiceManager  : InvoiceManager,
                    UserManager     : UserManager
                });
            });

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend({},
                mockGlobals.PAYMENT_MAINTENANCE_FORM.CONFIG,
                getConfig(mockMaintenance)
            ));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the min date range to yesterday", function () {
                expect(ctrl.minDate).toEqual(moment().subtract(1, "days").toDate());
            });

            it("should set the max date range to the expected time in the future", function () {
                expect(ctrl.maxDate).toEqual(moment().add(mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate());
            });

            it("should set hasMultipleBanks", function () {
                expect(ctrl.hasMultipleBanks).toEqual(mockHasMultipleBanks);
            });

            it("should set the payment", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

            it("should set the billing company", function () {
                expect(ctrl.billingCompany).toEqual(mockUser.billingCompany);
            });

            it("should set the invoice summary", function () {
                expect(ctrl.invoiceSummary).toEqual(mockCurrentInvoiceSummary);
            });

        });

    });

    function getConfig(maintenance) {
        switch (maintenance.state) {
            case maintenance.states.ADD:
                return mockGlobals.PAYMENT_MAINTENANCE_FORM.ADD.CONFIG;
            case maintenance.states.UPDATE:
                return mockGlobals.PAYMENT_MAINTENANCE_FORM.UPDATE.CONFIG;
            default:
                return null;
        }
    }

}());