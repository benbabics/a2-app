(function () {
    "use strict";

    var $q,
        $rootScope,
        MAKE_PAYMENT_AVAILABILITY_URL,
        billingAccountId = "141v51235",
        getMakePaymentAvailabilityModelDeferred,
        resolveHandler,
        rejectHandler,
        PaymentManager,
        PaymentsResource,
        PaymentsResourceOne,
        remoteMakePaymentAvailability = {};

    describe("A Payment Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.payment");

            // mock dependencies
            PaymentsResource = jasmine.createSpyObj("PaymentsResource", ["one"]);

            module(function ($provide) {
                $provide.value("PaymentsResource", PaymentsResource);
            });

            remoteMakePaymentAvailability = jasmine.createSpyObj("MakePaymentAvailabilityModel", ["MakePaymentAvailabilityModel", "set"]);

            inject(function (_$q_, _$rootScope_, globals, _PaymentManager_, MakePaymentAvailabilityModel) {
                remoteMakePaymentAvailability = new MakePaymentAvailabilityModel();

                $q = _$q_;
                $rootScope = _$rootScope_;
                PaymentManager = _PaymentManager_;
                PaymentManager.setMakePaymentAvailability(remoteMakePaymentAvailability);

                MAKE_PAYMENT_AVAILABILITY_URL = billingAccountId + "/" + globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.MAKE_PAYMENT_AVAILABILITY;
            });

            // set up spies
            PaymentsResourceOne = jasmine.createSpyObj("PaymentsResourceOne", ["doGET"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            PaymentsResource.one.and.returnValue(PaymentsResourceOne);
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a fetchMakePaymentAvailability function that", function () {

            var mockResponse = {
                data: {
                    makePaymentAllowed                    : "false",
                    shouldDisplayBankAccountSetupMessage  : "true",
                    shouldDisplayDirectDebitEnabledMessage: "false",
                    shouldDisplayOutstandingPaymentMessage: "true"
                }
            };


            beforeEach(function () {
                getMakePaymentAvailabilityModelDeferred = $q.defer();

                PaymentsResourceOne.doGET.and.returnValue(getMakePaymentAvailabilityModelDeferred.promise);

                PaymentManager.setMakePaymentAvailability(null);

                PaymentManager.fetchMakePaymentAvailability(billingAccountId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting a details of the make payment availability", function () {

                it("should call PaymentsResource.one", function () {
                    expect(PaymentsResource.one).toHaveBeenCalledWith();
                });

                it("should call PaymentsResourceOne.doGET with the correct URL", function () {
                    expect(PaymentsResourceOne.doGET).toHaveBeenCalledWith(MAKE_PAYMENT_AVAILABILITY_URL);
                });

            });

            describe("when the make payment availability is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getMakePaymentAvailabilityModelDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the make payment availability", function () {
                        expect(PaymentManager.getMakePaymentAvailability()).toEqual(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockResponse.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getMakePaymentAvailabilityModelDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the make payment availability", function () {
                        expect(PaymentManager.getMakePaymentAvailability()).toBeNull();
                    });

                });
            });

            describe("when retrieving the make payment availability fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getMakePaymentAvailabilityModelDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the make payment availability", function () {
                    expect(PaymentManager.getMakePaymentAvailability()).toBeNull();
                });

            });

        });

        describe("has a getMakePaymentAvailability function that", function () {

            var newMakePaymentAvailability = {
                makePaymentAllowed                    : "false",
                shouldDisplayBankAccountSetupMessage  : "true",
                shouldDisplayDirectDebitEnabledMessage: "false",
                shouldDisplayOutstandingPaymentMessage: "true"
            };

            it("should return the make payment availability passed to setMakePaymentAvailability", function () {
                var result;

                PaymentManager.setMakePaymentAvailability(newMakePaymentAvailability);
                result = PaymentManager.getMakePaymentAvailability();

                expect(result).toEqual(newMakePaymentAvailability);
            }) ;

            // TODO: figure out how to test this without using setMakePaymentAvailability
        });

        describe("has a setMakePaymentAvailability function that", function () {

            var newMakePaymentAvailability = {
                makePaymentAllowed                    : "false",
                shouldDisplayBankAccountSetupMessage  : "true",
                shouldDisplayDirectDebitEnabledMessage: "false",
                shouldDisplayOutstandingPaymentMessage: "true"
            };

            it("should update the make payment availability returned by getMakePaymentAvailability", function () {
                var result;

                PaymentManager.setMakePaymentAvailability(newMakePaymentAvailability);
                result = PaymentManager.getMakePaymentAvailability();

                expect(result).toEqual(newMakePaymentAvailability);
            }) ;

            // TODO: figure out how to test this without using getMakePaymentAvailability
        });

    });

})();