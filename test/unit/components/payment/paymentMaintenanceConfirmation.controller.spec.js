(function () {
    "use strict";

    var _,
        $scope,
        $cordovaGoogleAnalytics,
        ctrl,
        mockMaintenanceState,
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

            //mock dependencies:
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", ["trackView"]);

            inject(function ($controller, $rootScope, $q, appGlobals, CommonService) {

                _ = CommonService._;

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

                ctrl = $controller("PaymentMaintenanceConfirmationController", {
                    $scope                 : $scope,
                    $stateParams           : mockStateParams,
                    $cordovaGoogleAnalytics: $cordovaGoogleAnalytics,
                    maintenance            : mockMaintenance,
                    payment                : mockPayment,
                    globals                : mockGlobals
                });

                //setup spies:
                spyOn(CommonService, "waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });

            });
        });

        it("should set the config to the expected value", function () {
            expect(ctrl.config).toEqual(angular.extend({},
                mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION.CONFIG,
                getConfig(mockMaintenance)
            ));
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set payment to the expected value", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

            it("should call $cordovaGoogleAnalytics.trackView", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(getConfig(mockMaintenance).ANALYTICS.pageName);
            });
        });

    });

    function getConfig(maintenance) {
        switch (maintenance.state) {
            case maintenance.states.ADD:
                return mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION.ADD.CONFIG;
            case maintenance.states.UPDATE:
                return mockGlobals.PAYMENT_MAINTENANCE_CONFIRMATION.UPDATE.CONFIG;
            default:
                return null;
        }
    }

}());