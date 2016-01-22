(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        mockStateParams,
        mockMaintenance,
        mockGlobals = {
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

            inject(function ($controller, $rootScope, $q, appGlobals, CommonService, PaymentMaintenanceDetailsModel) {

                _ = CommonService._;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockMaintenance = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, appGlobals.PAYMENT_MAINTENANCE.STATES);
                mockStateParams = {
                    maintenanceState: mockMaintenance.state
                };

                ctrl = $controller("PaymentMaintenanceConfirmationController", {
                    $scope            : $scope,
                    $stateParams      : mockStateParams,
                    maintenanceDetails: mockMaintenance,
                    payment           : mockPayment,
                    globals           : mockGlobals
                });

            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(getConfig(mockMaintenance));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set payment to the expected value", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });
        });

    });

    function getConfig(maintenance) {
        var constants = mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION;

        if (_.has(constants, maintenance.state)) {
            return angular.extend({}, constants.CONFIG, constants[maintenance.state].CONFIG);
        }
        else {
            return constants.CONFIG;
        }
    }

}());