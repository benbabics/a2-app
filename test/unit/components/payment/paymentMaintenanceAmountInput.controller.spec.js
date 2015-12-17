(function () {
    "use strict";

    var ctrl,
        scope,
        CommonService,
        $ionicHistory,
        $cordovaGoogleAnalytics,
        mockPayment = {
            amount: TestUtils.getRandomNumber(1, 999)
        },
        mockInvoiceSumary = {
            currentBalance: TestUtils.getRandomNumber(1000, 10000)
        },
        mockGlobals = {
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
        mockMaintenanceState,
        mockStateParams,
        mockMaintenance;

    describe("A Payment Maintenance Amount Input Controller", function () {

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

            //mock dependencies:
            CommonService = jasmine.createSpyObj("CommonService", ["displayAlert", "waitForCordovaPlatform"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", ["trackView"]);

            inject(function ($rootScope, $controller, $filter, $q, appGlobals) {

                scope = $rootScope.$new();

                mockMaintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);
                mockStateParams = {
                    maintenanceState: mockMaintenanceState
                };
                mockMaintenance = {
                    state : mockMaintenanceState,
                    states: appGlobals.PAYMENT_MAINTENANCE.STATES,
                    go    : jasmine.createSpy("go")
                };

                ctrl = $controller("PaymentMaintenanceAmountInputController", {
                    $scope                 : scope,
                    $filter                : $filter,
                    $ionicHistory          : $ionicHistory,
                    $cordovaGoogleAnalytics: $cordovaGoogleAnalytics,
                    globals                : mockGlobals,
                    maintenance            : mockMaintenance,
                    payment                : mockPayment,
                    invoiceSummary         : mockInvoiceSumary,
                    CommonService          : CommonService
                });

                //setup mocks:
                CommonService.waitForCordovaPlatform.and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });

            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend({},
                mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT.CONFIG,
                mockGlobals.BUTTONS.CONFIG,
                getConfig(mockMaintenance)
            ));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the amount to the display payment amount", function () {
                expect(ctrl.amount).toEqual(getDisplayAmount(mockPayment.amount));
            });

            it("should call $cordovaGoogleAnalytics.trackView", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(getConfig(mockMaintenance).ANALYTICS.pageName);
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
                    expect(CommonService.displayAlert).toHaveBeenCalledWith(jasmine.objectContaining({
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
                    expect(CommonService.displayAlert).toHaveBeenCalledWith(jasmine.objectContaining({
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
                    expect(CommonService.displayAlert).not.toHaveBeenCalled();
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
                    expect(CommonService.displayAlert).not.toHaveBeenCalled();
                });

                it("should go back to the previous page", function () {
                    expect($ionicHistory.goBack).toHaveBeenCalledWith();
                });
            });
        });
    });

    function getConfig(maintenance) {
        switch (maintenance.state) {
            case maintenance.states.ADD:
                return mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT.ADD.CONFIG;
            case maintenance.states.UPDATE:
                return mockGlobals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT.UPDATE.CONFIG;
            default:
                return null;
        }
    }

    function getDisplayAmount(value) {
        return value * 100;
    }
}());