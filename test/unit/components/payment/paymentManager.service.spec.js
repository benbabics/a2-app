(function () {
    "use strict";

    var $q,
        $rootScope,
        billingAccountId = "141v51235",
        getPaymentAddAvailabilityModelDeferred,
        resolveHandler,
        rejectHandler,
        PaymentManager,
        PaymentsResource,
        PaymentsResourceOne,
        remotePaymentAddAvailabilityModel = {};

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

            remotePaymentAddAvailabilityModel = jasmine.createSpyObj("PaymentAddAvailabilityModel", ["PaymentAddAvailabilityModel", "set"]);

            inject(function (_$q_, _$rootScope_, globals, _PaymentManager_, PaymentAddAvailabilityModel) {
                remotePaymentAddAvailabilityModel = new PaymentAddAvailabilityModel();

                $q = _$q_;
                $rootScope = _$rootScope_;
                PaymentManager = _PaymentManager_;
                PaymentManager.setPaymentAddAvailability(remotePaymentAddAvailabilityModel);
            });

            // set up spies
            PaymentsResourceOne = jasmine.createSpyObj("PaymentsResourceOne", ["paymentAddAvailability"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            PaymentsResource.one.and.returnValue(PaymentsResourceOne);
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a fetchPaymentAddAvailability function that", function () {

            var mockResponse = {
                data: {
                    makePaymentAllowed                    : "false",
                    shouldDisplayBankAccountSetupMessage  : "true",
                    shouldDisplayDirectDebitEnabledMessage: "false",
                    shouldDisplayOutstandingPaymentMessage: "true"
                }
            };


            beforeEach(function () {
                getPaymentAddAvailabilityModelDeferred = $q.defer();

                PaymentsResourceOne.paymentAddAvailability.and.returnValue(getPaymentAddAvailabilityModelDeferred.promise);

                PaymentManager.setPaymentAddAvailability(null);

                PaymentManager.fetchPaymentAddAvailability(billingAccountId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting a details of the payment add availability", function () {

                it("should call PaymentsResource.one with the correct account id", function () {
                    expect(PaymentsResource.one).toHaveBeenCalledWith(billingAccountId);
                });

                it("should call PaymentsResourceOne.paymentAddAvailability", function () {
                    expect(PaymentsResourceOne.paymentAddAvailability).toHaveBeenCalledWith();
                });

            });

            describe("when the payment add availability is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getPaymentAddAvailabilityModelDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the payment add availability", function () {
                        expect(PaymentManager.getPaymentAddAvailability()).toEqual(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockResponse.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getPaymentAddAvailabilityModelDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the payment add availability", function () {
                        expect(PaymentManager.getPaymentAddAvailability()).toBeNull();
                    });

                });
            });

            describe("when retrieving the payment add availability fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getPaymentAddAvailabilityModelDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the payment add availability", function () {
                    expect(PaymentManager.getPaymentAddAvailability()).toBeNull();
                });

            });

        });

        describe("has a getPaymentAddAvailability function that", function () {

            var newPaymentAddAvailability = {
                makePaymentAllowed                    : "false",
                shouldDisplayBankAccountSetupMessage  : "true",
                shouldDisplayDirectDebitEnabledMessage: "false",
                shouldDisplayOutstandingPaymentMessage: "true"
            };

            it("should return the payment add availability passed to setPaymentAddAvailability", function () {
                var result;

                PaymentManager.setPaymentAddAvailability(newPaymentAddAvailability);
                result = PaymentManager.getPaymentAddAvailability();

                expect(result).toEqual(newPaymentAddAvailability);
            }) ;

            // TODO: figure out how to test this without using setPaymentAddAvailability
        });

        describe("has a setPaymentAddAvailability function that", function () {

            var newPaymentAddAvailability = {
                makePaymentAllowed                    : "false",
                shouldDisplayBankAccountSetupMessage  : "true",
                shouldDisplayDirectDebitEnabledMessage: "false",
                shouldDisplayOutstandingPaymentMessage: "true"
            };

            it("should update the payment add availability returned by getPaymentAddAvailability", function () {
                var result;

                PaymentManager.setPaymentAddAvailability(newPaymentAddAvailability);
                result = PaymentManager.getPaymentAddAvailability();

                expect(result).toEqual(newPaymentAddAvailability);
            }) ;

            // TODO: figure out how to test this without using getPaymentAddAvailability
        });

    });

})();