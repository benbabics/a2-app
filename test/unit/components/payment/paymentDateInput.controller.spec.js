(function () {
    "use strict";

    var ctrl,
        scope,
        $ionicHistory,
        moment,
        mockGlobals = {
            PAYMENT_ADD: {
                "INPUTS": {
                    "DATE": {
                        "CONFIG": {
                            "title"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "maxFutureDays": TestUtils.getRandomInteger(1, 365)
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
        mockDateGlobals = angular.extend({}, mockGlobals.PAYMENT_ADD.INPUTS.DATE.CONFIG, mockGlobals.BUTTONS.CONFIG);

    describe("A Payment Date Input Controller", function () {

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
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($rootScope, $controller, globals, _moment_) {
                moment = _moment_;

                scope = $rootScope.$new();

                ctrl = $controller("PaymentDateInputController", {
                    $scope       : scope,
                    $ionicHistory: $ionicHistory,
                    globals      : globals,
                    moment       : moment
                });

            });
        });

        it("should set the date to today", function () {
            expect(ctrl.date).toEqual(moment().toDate());
        });

        it("should set the min date range to yesterday", function () {
            expect(ctrl.minDate).toEqual(moment().subtract(1, "days").toDate());
        });

        it("should set the max date range to the expected time in the future", function () {
            expect(ctrl.maxDate).toEqual(moment().add(mockDateGlobals.maxFutureDays, "days").toDate());
        });

        describe("has a done function that", function () {

            it("should go back to the previous page", function () {
                ctrl.done();

                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();