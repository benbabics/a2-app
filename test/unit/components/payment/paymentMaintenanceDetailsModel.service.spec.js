(function () {
    "use strict";

    describe("A Payment Maintenance Details Model Service", function () {
        var _,
            $rootScope,
            $state,
            $injector,
            $q,
            globals,
            paymentMaintenanceDetails,
            AuthenticationManager,
            PaymentManager,
            BankManager,
            PaymentModel,
            BankModel;

        beforeEach(function () {
            module("app.shared");
            module("app.components");
            module("app.html");

            //mock dependencies:
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayment"]);
            BankManager = jasmine.createSpyObj("BankManager", ["getDefaultBank", "hasMultipleBanks"]);

            module(function($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("BankManager", BankManager);
            });

            inject(function (___, _$injector_, _$rootScope_, _$state_, _$q_,
                             _globals_, _BankModel_, _PaymentModel_, PaymentMaintenanceDetailsModel) {
                $rootScope = _$rootScope_;
                $injector = _$injector_;
                $state = _$state_;
                $q = _$q_;
                globals = _globals_;
                BankModel = _BankModel_;
                PaymentModel = _PaymentModel_;
                _ = ___;

                paymentMaintenanceDetails = TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, globals.PAYMENT_MAINTENANCE.STATES);
            });

            //setup spies:
            AuthenticationManager.userLoggedIn.and.returnValue(true);
            PaymentManager.fetchPayment.and.returnValue($q.when(TestUtils.getRandomPayment(PaymentModel, BankModel)));
            BankManager.getDefaultBank.and.returnValue($q.when(TestUtils.getRandomBank(BankModel)));
            BankManager.hasMultipleBanks.and.returnValue($q.when(TestUtils.getRandomBoolean()));
        });

        describe("has a set function that", function () {

            var mockPaymentMaintenanceDetailsResource,
                paymentMaintenanceDetailsKeys,
                mockPaymentMaintenanceDetailsResourceKeys;

            beforeEach(inject(function (appGlobals, PaymentMaintenanceDetailsModel) {
                paymentMaintenanceDetails = new PaymentMaintenanceDetailsModel();

                mockPaymentMaintenanceDetailsResource = angular.extend(TestUtils.getRandomPaymentMaintenanceDetails(PaymentMaintenanceDetailsModel, appGlobals.PAYMENT_MAINTENANCE.STATES), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in paymentMaintenanceDetails) {
                    if (_.has(paymentMaintenanceDetails, property)) {
                        paymentMaintenanceDetails[property] = "default";
                    }
                }

                paymentMaintenanceDetailsKeys = _.keys(paymentMaintenanceDetails);
                mockPaymentMaintenanceDetailsResourceKeys = _.keys(mockPaymentMaintenanceDetailsResource);
            }));

            it("should set the paymentMaintenanceDetails object with the fields from the passed in mockPaymentMaintenanceDetailsResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(paymentMaintenanceDetailsKeys, mockPaymentMaintenanceDetailsResourceKeys);

                paymentMaintenanceDetails.set(mockPaymentMaintenanceDetailsResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(paymentMaintenanceDetails[key]).toEqual(mockPaymentMaintenanceDetailsResource[key]);
                }
            });

            it("should NOT change the paymentMaintenanceDetails object fields that the mockPaymentMaintenanceDetailsResource object does not have", function () {
                var key,
                    keysDifference = _.difference(paymentMaintenanceDetailsKeys, mockPaymentMaintenanceDetailsResourceKeys);

                paymentMaintenanceDetails.set(mockPaymentMaintenanceDetailsResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(paymentMaintenanceDetails[key]).toEqual("default");
                }
            });

            it("should extend the paymentMaintenanceDetails object with the fields from the passed in mockPaymentMaintenanceDetailsResource object that the paymentMaintenanceDetails does not have", function () {
                var key,
                    keysDifference = _.difference(mockPaymentMaintenanceDetailsResourceKeys, paymentMaintenanceDetailsKeys);

                paymentMaintenanceDetails.set(mockPaymentMaintenanceDetailsResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(paymentMaintenanceDetails, key)).toBeTruthy();
                    expect(paymentMaintenanceDetails[key]).toEqual(mockPaymentMaintenanceDetailsResource[key]);
                }
            });

        });

        describe("has a getConfig function that", function () {
            var constants;

            describe("when the maintenance state is invalid", function () {

                beforeEach(function () {
                    paymentMaintenanceDetails.state = null;
                    constants = getMockConstants({hasConfig: true, hasMaintenanceConfigs: true});
                });

                it("should throw an error", function () {
                    expect(_.bind(paymentMaintenanceDetails.getConfig, paymentMaintenanceDetails)).toThrowError(
                        "Failed to get maintenance config (state: " + paymentMaintenanceDetails.state + ")"
                    );
                });
            });

            describe("when the given constants don't contain a CONFIG object", function () {

                beforeEach(function () {
                    paymentMaintenanceDetails.state = null;
                    constants = getMockConstants({hasConfig: false});
                });

                it("should throw an error", function () {
                    expect(_.bind(paymentMaintenanceDetails.getConfig, paymentMaintenanceDetails)).toThrowError(
                        "Failed to get maintenance config (state: " + paymentMaintenanceDetails.state + ")"
                    );
                });
            });

            describe("when the maintenance state is valid and there is a CONFIG object in the given constants", function () {

                beforeEach(function () {
                    paymentMaintenanceDetails.state = TestUtils.getRandomValueFromMap(paymentMaintenanceDetails.getStates());
                });

                describe("when the given constants do NOT have override constant values for the maintenance state", function () {

                    beforeEach(function () {
                        constants = getMockConstants({hasConfig: true, hasMaintenanceConfigs: false});
                    });

                    it("should return the CONFIG object", function () {
                        expect(paymentMaintenanceDetails.getConfig(constants)).toEqual(constants.CONFIG);
                    });
                });

                describe("when the given constants have override constant values for the maintenance state", function () {

                    beforeEach(function () {
                        constants = getMockConstants({hasConfig: true, hasMaintenanceConfigs: true});
                    });

                    it("should return the CONFIG object extended by the CONFIG object for the current maintenance state", function () {
                        expect(paymentMaintenanceDetails.getConfig(constants)).toEqual(
                            angular.extend({}, constants.CONFIG, constants[paymentMaintenanceDetails.state.toUpperCase()].CONFIG)
                        );
                    });
                });
            });
        });

        describe("has a getStates function that", function () {

            it("should return PAYMENT_MAINTENANCE.STATES from globals", function () {
                expect(paymentMaintenanceDetails.getStates()).toEqual(globals.PAYMENT_MAINTENANCE.STATES);
            });
        });

        describe("has a go function that", function () {
            var mockMaintenanceState = "payment.maintenance.form";

            describe("when no parameters are passed", function () {

                beforeEach(function () {
                    paymentMaintenanceDetails.go(mockMaintenanceState);
                    $rootScope.$digest();
                });

                it("should transition to the expected maintenance view state", function () {
                    expect($state.$current.name).toEqual(mockMaintenanceState);
                });

                it("should set the state params to the expected maintenance state value", function () {
                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual(jasmine.objectContaining({maintenanceState: paymentMaintenanceDetails.state}));
                    });
                });
            });

            describe("when additional invalid parameters are passed", function () {
                var params;

                beforeEach(function () {
                    var numParams = TestUtils.getRandomInteger(1, 3);
                    params = {};

                    for (var i = 0; i < numParams; ++i) {
                        params[TestUtils.getRandomStringThatIsAlphaNumeric(20)] = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    }

                    paymentMaintenanceDetails.go(mockMaintenanceState, params);
                    $rootScope.$digest();
                });

                it("should transition to the expected maintenance view state", function () {
                    expect($state.$current.name).toEqual(mockMaintenanceState);
                });

                it("should set the state params to the expected maintenance state value and ignore the invalid parameters", function () {
                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual(jasmine.objectContaining({maintenanceState: paymentMaintenanceDetails.state}));
                    });
                });
            });

            describe("when additional valid parameters are passed", function () {
                var params;

                beforeEach(function () {
                    //note: "valid" parameters depend on which state we are transitioning to
                    params = {
                        "paymentId": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    paymentMaintenanceDetails.go(mockMaintenanceState, params);
                    $rootScope.$digest();
                });

                it("should transition to the expected maintenance view state", function () {
                    expect($state.$current.name).toEqual(mockMaintenanceState);
                });

                it("should set the state params to the given params along with the expected maintenance state value", function () {
                    $injector.invoke(function ($stateParams) {
                        expect($stateParams).toEqual(angular.extend({maintenanceState: paymentMaintenanceDetails.state}, params));
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
                _.each(_.keys(paymentMaintenanceDetails.getStates()), function (maintenanceState) {
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