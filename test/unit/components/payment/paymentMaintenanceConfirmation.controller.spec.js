(function () {
    "use strict";

    var _,
        $scope,
        PaymentMaintenanceUtil,
        MockPaymentMaintenanceUtil,
        Navigation,
        ctrl,
        maintenanceState,
        mockStateParams,
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
            PAYMENT_MAINTENANCE_CONFIRMATION: {
                "CONFIG": {
                    "title"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationText": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "amount"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "bankAccount"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "scheduledDate"   : TestUtils.getRandomDate(),
                    "activityButton"  : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "ADD"   : {
                    "CONFIG": {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },

                "UPDATE": {
                    "CONFIG": {
                        "ANALYTICS"                 : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            }
        },
        mockPayment = {
            amount       : 150.00,
            bankAccount  : "bank account value",
            scheduledDate: "2015-05-26"
        };

    describe("A Payment Maintenance Confirmation Controller", function () {

        beforeEach(function () {

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            //mock dependencies
            MockPaymentMaintenanceUtil = jasmine.createSpyObj("PaymentMaintenanceUtil", ["getConfig"]);
            Navigation = jasmine.createSpyObj("Navigation", ["goToPaymentActivity"]);

            inject(function (___, $controller, $rootScope, $q, appGlobals, _PaymentMaintenanceUtil_) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();
                _ = ___;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;

                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                //mock calls to PaymentMaintenanceUtil to pass the maintenanceState explicitly
                MockPaymentMaintenanceUtil.getConfig.and.callFake(function (constants) {
                    return PaymentMaintenanceUtil.getConfig(constants, maintenanceState);
                });

                ctrl = $controller("PaymentMaintenanceConfirmationController", {
                    $scope                : $scope,
                    $stateParams          : mockStateParams,
                    payment               : mockPayment,
                    globals               : mockGlobals,
                    Navigation            : Navigation,
                    PaymentMaintenanceUtil: MockPaymentMaintenanceUtil
                });

            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(
                PaymentMaintenanceUtil.getConfig(mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION, maintenanceState)
            );
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set payment to the expected value", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });
        });

        describe("has a goToPaymentActivity function that", function () {

            beforeEach(function () {
                ctrl.goToPaymentActivity();
            });

            it("should call Navigation.goToPaymentActivity", function () {
                expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
            });
        });
    });
}());
