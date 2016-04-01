(function () {
    "use strict";

    var _,
        appGlobals,
        $q,
        $rootScope,
        $state,
        AnalyticsUtil,
        Navigation,
        PaymentMaintenanceUtil,
        Popup,
        resolveHandler,
        rejectHandler;

    describe("A PaymentMaintenanceUtil service", function () {

        beforeEach(function () {
            //mock dependencies
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            Navigation = jasmine.createSpyObj("Navigation", ["goToPaymentActivity", "isSecuredState"]);
            Popup = jasmine.createSpyObj("Popup", ["displayAlert"]);

            module("app.shared");
            module("app.components", function($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("Navigation", Navigation);
                $provide.value("Popup", Popup);

            });
            module("app.html");

            inject(function (___, _$q_, _$rootScope_, _$state_, _appGlobals_, Navigation, _PaymentMaintenanceUtil_) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                appGlobals = _appGlobals_;
                PaymentMaintenanceUtil = _PaymentMaintenanceUtil_;
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has a getConfig function that", function () {
            var constants,
                maintenanceState;

            describe("when the given constants don't contain a CONFIG object", function () {

                beforeEach(function () {
                    constants = getMockConstants({hasConfig: false});
                    maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);
                });

                it("should throw an error", function () {
                    expect(function () {
                        PaymentMaintenanceUtil.getConfig(constants, maintenanceState);
                    }).toThrowError(
                        "Failed to get maintenance config (state: " + maintenanceState + ")"
                    );
                });
            });

            describe("when there is a CONFIG object in the given constants", function () {

                beforeEach(function () {
                    maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);
                });

                describe("when the given constants do NOT have override constant values for the maintenance state", function () {

                    beforeEach(function () {
                        constants = getMockConstants({hasConfig: true, hasMaintenanceConfigs: false});
                    });

                    it("should return the CONFIG object", function () {
                        expect(PaymentMaintenanceUtil.getConfig(constants, maintenanceState)).toEqual(constants.CONFIG);
                    });
                });

                describe("when the given constants have override constant values for the maintenance state", function () {

                    beforeEach(function () {
                        constants = getMockConstants({hasConfig: true, hasMaintenanceConfigs: true});
                    });

                    it("should return the CONFIG object extended by the CONFIG object for the current maintenance state", function () {
                        expect(PaymentMaintenanceUtil.getConfig(constants, maintenanceState)).toEqual(
                            angular.extend({}, constants.CONFIG, constants[maintenanceState.toUpperCase()].CONFIG)
                        );
                    });
                });
            });
        });

        describe("has a getActiveState function that", function () {
            var viewStateName,
                maintenanceState;

            beforeEach(function () {
                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                spyOn($state, "go").and.callThrough();
            });

            describe("when the current view state has a maintenanceState", function () {

                beforeEach(function () {
                    viewStateName = "payment.maintenance.form";

                    $state.go(viewStateName, {maintenanceState: maintenanceState});
                    $rootScope.$digest();
                });

                //TODO - Figure out why this test doesn't work
                xit("should return the current view state's maintenanceState", function () {
                    expect(PaymentMaintenanceUtil.getActiveState()).toEqual($state.current.data.maintenanceState);
                });
            });

            describe("when the current view state does NOT have a maintenanceState", function () {

                beforeEach(function () {
                    viewStateName = "user.auth.login";

                    $state.go(viewStateName);
                    $rootScope.$digest();
                });

                it("should throw an error", function () {
                    var expectedError = "Failed to get maintenance state from the current view state.";

                    expect(PaymentMaintenanceUtil.getActiveState).toThrowError(expectedError);
                });
            });
        });

        describe("has a getStates function that", function () {

            it("should return PAYMENT_MAINTENANCE.STATES from globals", function () {
                expect(PaymentMaintenanceUtil.getStates()).toEqual(appGlobals.PAYMENT_MAINTENANCE.STATES);
            });
        });

        describe("has a go function that", function () {
            var viewStateName,
                params,
                maintenanceState;

            beforeEach(function () {
                viewStateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                maintenanceState = TestUtils.getRandomValueFromMap(appGlobals.PAYMENT_MAINTENANCE.STATES);

                spyOn($state, "go").and.callThrough();
                spyOn($state, "transitionTo");
            });

            describe("when given params", function () {
                var params;

                beforeEach(function () {
                    var numParams = TestUtils.getRandomInteger(0, 10);
                    params = {};

                    for (var i = 0; i < numParams; ++i) {
                        params[TestUtils.getRandomStringThatIsAlphaNumeric(10)] = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    }

                    PaymentMaintenanceUtil.go(viewStateName, params, maintenanceState);
                });

                it("should call $state.go with the expected values", function () {
                    expect($state.go).toHaveBeenCalledWith(viewStateName, angular.extend({maintenanceState: maintenanceState}, params));
                });
            });

            describe("when NOT given params", function () {

                beforeEach(function () {
                    PaymentMaintenanceUtil.go(viewStateName, undefined, maintenanceState);
                });

                it("should call $state.go with the expected values", function () {
                    expect($state.go).toHaveBeenCalledWith(viewStateName, {maintenanceState: maintenanceState});
                });
            });
        });

        describe("has a showPaymentError function that", function () {
            var errorMessage,
                goToPaymentActivityDeferred,
                displayAlertDeferred;

            beforeEach(function () {
                errorMessage = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                goToPaymentActivityDeferred = $q.defer();
                displayAlertDeferred = $q.defer();

                Navigation.goToPaymentActivity.and.returnValue(goToPaymentActivityDeferred.promise);
                Popup.displayAlert.and.returnValue(displayAlertDeferred.promise);
            });

            describe("when given an analytics event to track", function () {
                var analyticsEvent;

                beforeEach(function () {
                    analyticsEvent = TestUtils.getRandomAnalyticsEvent();

                    PaymentMaintenanceUtil.showPaymentError(errorMessage, analyticsEvent)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call AnalyticsUtil.trackEvent with the expected values", function () {
                    expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(analyticsEvent);
                });

                describe("when going to the payment activity page succeeds", function () {

                    beforeEach(function () {
                        goToPaymentActivityDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call Popup.displayAlert with the expected values", function () {
                        expect(Popup.displayAlert).toHaveBeenCalledWith({
                            content       : errorMessage,
                            buttonCssClass: "button-submit"
                        });
                    });

                    describe("when displaying the popup succeeds", function () {

                        beforeEach(function () {
                            displayAlertDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when displaying the popup fails", function () {
                        var error;

                        beforeEach(function () {
                            error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            displayAlertDeferred.reject(error);
                            $rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(rejectHandler).toHaveBeenCalledWith(error);
                        });
                    });
                });

                describe("when going to the payment activity page fails", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        goToPaymentActivityDeferred.reject(error);
                        $rootScope.$digest();
                    });

                    it("should reject", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });

                    it("should NOT call Popup.displayAlert", function () {
                        expect(Popup.displayAlert).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given an analytics event to track", function () {

                beforeEach(function () {
                    PaymentMaintenanceUtil.showPaymentError(errorMessage)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                describe("when going to the payment activity page succeeds", function () {

                    beforeEach(function () {
                        goToPaymentActivityDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call Popup.displayAlert with the expected values", function () {
                        expect(Popup.displayAlert).toHaveBeenCalledWith({
                            content       : errorMessage,
                            buttonCssClass: "button-submit"
                        });
                    });

                    describe("when displaying the popup succeeds", function () {

                        beforeEach(function () {
                            displayAlertDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when displaying the popup fails", function () {
                        var error;

                        beforeEach(function () {
                            error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            displayAlertDeferred.reject(error);
                            $rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(rejectHandler).toHaveBeenCalledWith(error);
                        });
                    });
                });

                describe("when going to the payment activity page fails", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        goToPaymentActivityDeferred.reject(error);
                        $rootScope.$digest();
                    });

                    it("should reject", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });

                    it("should NOT call Popup.displayAlert", function () {
                        expect(Popup.displayAlert).not.toHaveBeenCalled();
                    });
                });
            });
        });

        function getMockConstants(options) {
            var constants = {},
                configKeys = [],
                numKeys = TestUtils.getRandomInteger(1, 10);

            options = options || {};

            for (var i = 0; i < numKeys; ++i) {
                configKeys.push(TestUtils.getRandomStringThatIsAlphaNumeric(20));
            }

            if (options.hasConfig) {
                //create a config object with the given keys and map to random values
                constants.CONFIG = _.zipObject(configKeys, _.map(configKeys, function () {
                    return TestUtils.getRandomStringThatIsAlphaNumeric(10);
                }));
            }

            if (options.hasMaintenanceConfigs) {
                //create a maintenance and config object for each maintenance state that has a subset of keys from the main config
                _.each(_.keys(appGlobals.PAYMENT_MAINTENANCE.STATES), function (maintenanceState) {
                    var maintenanceConfigKeys = _.slice(configKeys, TestUtils.getRandomInteger(1, numKeys));
                    constants[maintenanceState] = {};

                    constants[maintenanceState].CONFIG = _.zipObject(maintenanceConfigKeys, _.map(maintenanceConfigKeys, function () {
                        return TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    }));
                });
            }

            return constants;
        }
    });
})();
