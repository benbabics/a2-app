(function () {
    "use strict";

    var _,
        ctrl,
        scope,
        PopupUtil,
        PlatformUtil,
        $ionicHistory,
        mockPayment = {
            amount: TestUtils.getRandomNumber(1, 999)
        },
        mockInvoiceSumary = {
            currentBalance: TestUtils.getRandomNumber(1000, 10000)
        },
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
                "INPUTS": {
                    "AMOUNT": {
                        "CONFIG": {
                            "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "ERRORS": {
                            "zeroPayment"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "paymentTooLarge": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "ADD": {
                            "CONFIG": {
                                "ANALYTICS": {
                                    "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                }
                            }
                        },
                        "UPDATE": {
                            "CONFIG": {
                                "ANALYTICS": {
                                    "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                }
                            }
                        }
                    }
                }
            },

            BUTTONS: {
                "CONFIG": {
                    "cancel": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "done"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockStateParams,
        mockMaintenance;

    describe("A Payment Maintenance Amount Input Controller", function () {

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

            //mock dependencies:
            PopupUtil = jasmine.createSpyObj("PopupUtil", ["displayAlert"]);
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", ["waitForCordovaPlatform"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function (___, $rootScope, $controller, $filter, $q, appGlobals, PaymentMaintenanceDetailsModel) {
                _ = ___;

                scope = $rootScope.$new();

                mockMaintenance = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, appGlobals.PAYMENT_MAINTENANCE.STATES);
                mockStateParams = {
                    maintenanceState: mockMaintenance.state
                };

                ctrl = $controller("PaymentMaintenanceAmountInputController", {
                    $scope            : scope,
                    $filter           : $filter,
                    $ionicHistory     : $ionicHistory,
                    globals           : mockGlobals,
                    maintenanceDetails: mockMaintenance,
                    payment           : mockPayment,
                    invoiceSummary    : mockInvoiceSumary,
                    PopupUtil         : PopupUtil,
                    PlatformUtil      : PlatformUtil
                });
            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend({}, mockGlobals.BUTTONS.CONFIG, getConfig(mockMaintenance)));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the amount to the display payment amount", function () {
                expect(ctrl.amount).toEqual(getDisplayAmount(mockPayment.amount));
            });
        });

        describe("has an onInputChange function that", function () {

            beforeEach(function () {
                ctrl.amount = TestUtils.getRandomNumber(1, 500);
            });

            describe("when the input value is a backspace", function () {

                beforeEach(function () {
                    ctrl.onInputChange("\b", ctrl.amount, ctrl.amount);
                });

                it("should set the amount to 0", function () {
                    expect(ctrl.amount).toEqual(0);
                });
            });

            describe("when the input value is a number", function () {
                var number;

                beforeEach(function () {
                    number = TestUtils.getRandomNumber(0, 9);
                    ctrl.onInputChange(number, ctrl.amount, ctrl.amount);
                });

                it("should set the amount to the number", function () {
                    expect(ctrl.amount).toEqual(number);
                });

                describe("and when it is called twice", function () {

                    beforeEach(function () {
                        ctrl.onInputChange(number, ctrl.amount, ctrl.amount);
                    });

                    it("should not modify the amount the second time", function () {
                        expect(ctrl.amount).toEqual(number);
                    });
                });
            });
        });

        describe("has a done function that", function () {

            describe("when the amount is zero", function () {

                beforeEach(function () {
                    ctrl.amount = getDisplayAmount(0);

                    ctrl.done();
                });

                it("should show the expected error", function () {
                    expect(PopupUtil.displayAlert).toHaveBeenCalledWith(jasmine.objectContaining({
                        content: mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT.ERRORS.zeroPayment
                    }));
                });

                it("should NOT go back to the previous page", function () {
                    expect($ionicHistory.goBack).not.toHaveBeenCalled();
                });
            });

            describe("when the amount is greater than the current balance", function () {

                beforeEach(function () {
                    ctrl.amount = getDisplayAmount(mockInvoiceSumary.currentBalance + 1);

                    ctrl.done();
                });

                it("should show the expected error", function () {
                    expect(PopupUtil.displayAlert).toHaveBeenCalledWith(jasmine.objectContaining({
                        content: mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT.ERRORS.paymentTooLarge
                    }));
                });

                it("should NOT go back to the previous page", function () {
                    expect($ionicHistory.goBack).not.toHaveBeenCalled();
                });
            });

            describe("when the amount is greater than 0 but less than the current balance", function () {

                beforeEach(function () {
                    ctrl.amount = getDisplayAmount(TestUtils.getRandomNumber(1, mockInvoiceSumary.currentBalance));

                    ctrl.done();
                });

                it("should NOT show an error", function () {
                    expect(PopupUtil.displayAlert).not.toHaveBeenCalled();
                });

                it("should go back to the previous page", function () {
                    expect($ionicHistory.goBack).toHaveBeenCalledWith();
                });
            });

            describe("when the amount is equal to the current balance", function () {

                beforeEach(function () {
                    ctrl.amount = mockInvoiceSumary.currentBalance;

                    ctrl.done();
                });

                it("should NOT show an error", function () {
                    expect(PopupUtil.displayAlert).not.toHaveBeenCalled();
                });

                it("should go back to the previous page", function () {
                    expect($ionicHistory.goBack).toHaveBeenCalledWith();
                });
            });
        });
    });

    function getConfig(maintenance) {
        var constants = mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT;

        if (_.has(constants, maintenance.state)) {
            return angular.extend({}, constants.CONFIG, constants[maintenance.state].CONFIG);
        }
        else {
            return constants.CONFIG;
        }
    }

    function getDisplayAmount(value) {
        return value * 100;
    }
}());