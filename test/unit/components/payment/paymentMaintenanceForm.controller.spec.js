(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        BankManager,
        BankModel,
        InvoiceManager,
        mockStateParams,
        mockMaintenance,
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
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
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },
                "UPDATE": {
                    "CONFIG": {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
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
            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
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

            // mock dependencies
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function ($controller, $rootScope, $q, _moment_, _BankModel_, appGlobals, CommonService, PaymentMaintenanceDetailsModel) {

                _ = CommonService._;
                moment = _moment_;
                BankModel = _BankModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockMaintenance = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, appGlobals.PAYMENT_MAINTENANCE.STATES);
                mockStateParams = {
                    maintenanceState: mockMaintenance.state
                };

                ctrl = $controller("PaymentMaintenanceFormController", {
                    $scope            : $scope,
                    $stateParams      : mockStateParams,
                    hasMultipleBanks  : mockHasMultipleBanks,
                    maintenanceDetails: mockMaintenance,
                    payment           : mockPayment,
                    globals           : mockGlobals,
                    BankManager       : BankManager,
                    InvoiceManager    : InvoiceManager,
                    UserManager       : UserManager
                });
            });

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(getConfig(mockMaintenance));
        });

        it("should set backStateOverride to the expected value", function () {
            expect(ctrl.backStateOverride).toEqual(getBackStateOverride(mockMaintenance));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;

                jasmine.clock().mockDate();

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

    function getBackStateOverride(maintenance) {
        if (maintenance.state === maintenance.getStates().ADD) {
            return "landing";
        }

        return null;
    }

    function getConfig(maintenance) {
        var constants = mockGlobals.PAYMENT_MAINTENANCE_FORM;

        if (_.has(constants, maintenance.state)) {
            return angular.extend({}, constants.CONFIG, constants[maintenance.state].CONFIG);
        }
        else {
            return constants.CONFIG;
        }
    }

}());