(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        BankManager,
        BankModel,
        InvoiceManager,
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
        UserManager,
        ionicDatePicker;

    describe("A Payment Maintenance Form Controller", function () {

        beforeEach(function () {

            // mock dependencies
            BankManager = jasmine.createSpyObj("BankManager", ["getActiveBanks"]);
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["getInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            MockPaymentMaintenanceUtil = jasmine.createSpyObj("PaymentMaintenanceUtil", ["getConfig", "go", "isAddState"]);
            ionicDatePicker = jasmine.createSpyObj("ionicDatePicker", ["openDatePicker"]);

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            inject(function (___, $controller, $rootScope, $q, _moment_, _BankModel_, appGlobals, _PaymentMaintenanceUtil_) {

                _ = ___;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                //mock calls to PaymentMaintenanceUtil to pass the maintenanceState explicitly
                MockPaymentMaintenanceUtil.getConfig.and.callFake(function (constants) {
                    return PaymentMaintenanceUtil.getConfig(constants, maintenanceState);
                });

                MockPaymentMaintenanceUtil.isAddState.and.callFake(function () {
                    return PaymentMaintenanceUtil.isAddState(maintenanceState);
                });

                ctrl = $controller("PaymentMaintenanceFormController", {
                    $scope                : $scope,
                    hasMultipleBanks      : mockHasMultipleBanks,
                    ionicDatePicker       : ionicDatePicker,
                    payment               : mockPayment,
                    globals               : mockGlobals,
                    BankManager           : BankManager,
                    InvoiceManager        : InvoiceManager,
                    PaymentMaintenanceUtil: MockPaymentMaintenanceUtil,
                    UserManager           : UserManager
                });
            });

            InvoiceManager.getInvoiceSummary.and.returnValue(mockCurrentInvoiceSummary);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_FORM, maintenanceState));
        });

        it("should set backStateOverride to the expected value", function () {
            expect(ctrl.backStateOverride).toEqual(getBackStateOverride(maintenanceState));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                //setup an existing values to test them being modified
                ctrl.hasAnyCards = null;

                $scope.$broadcast("$ionicView.beforeEnter");
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

        describe("has a goToPage function that", function () {
            var stateName,
                params;

            beforeEach(function () {
                var numParams = TestUtils.getRandomInteger(0, 10);
                stateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                params = {};

                for (var i = 0; i < numParams; ++i) {
                    params[TestUtils.getRandomStringThatIsAlphaNumeric(10)] = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                }

                ctrl.goToPage(stateName, params);
            });

            it("should call PaymentMaintenanceUtil.go with the expected values", function () {
                expect(MockPaymentMaintenanceUtil.go).toHaveBeenCalledWith(stateName, params);
            });
        });

        describe("has an openDatePicker function that", function () {
            var fromDate,
                toDate;

            beforeEach(function () {
                jasmine.clock().mockDate();

                fromDate = moment().toDate();
                toDate = moment().add(mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate();

                $scope.$broadcast("$ionicView.beforeEnter");
                $scope.$digest();
            });

            describe("when there is already a scheduled date", function () {

                beforeEach(function () {
                    ctrl.payment.scheduledDate = TestUtils.getRandomDate();

                    ctrl.openDatePicker();
                });

                it("should call ionicDatePicker.openDatePicker with the expected values", function () {
                    expect(ionicDatePicker.openDatePicker).toHaveBeenCalledWith({
                        callback : jasmine.any(Function),
                        inputDate: ctrl.payment.scheduledDate,
                        from     : fromDate,
                        to       : toDate
                    });
                });
            });

            describe("when there is NOT already a scheduled date", function () {

                beforeEach(function () {
                    delete ctrl.payment.scheduledDate;

                    ctrl.openDatePicker();
                });

                it("should call ionicDatePicker.openDatePicker with the expected values", function () {
                    expect(ionicDatePicker.openDatePicker).toHaveBeenCalledWith({
                        callback : jasmine.any(Function),
                        from     : fromDate,
                        to       : toDate
                    });
                });
            });
        });

    });

    function getBackStateOverride(maintenanceState) {
        if (PaymentMaintenanceUtil.isAddState(maintenanceState)) {
            return "landing";
        }

        return null;
    }

}());
