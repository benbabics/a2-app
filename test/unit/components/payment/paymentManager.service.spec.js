(function () {
    "use strict";

    var $q,
        $rootScope,
        accountId = TestUtils.getRandomStringThatIsAlphaNumeric(10),
        moment,
        pageNumber = TestUtils.getRandomNumberWithLength(1),
        pageSize = TestUtils.getRandomNumberWithLength(2),
        resolveHandler,
        rejectHandler,
        BankModel,
        PaymentManager,
        PaymentModel,
        PaymentsResource,
        mockPaymentAddAvailability = {},
        paymentModel1, paymentModel2, paymentModel3,
        mockPaymentCollection = {},
        remotePaymentAddAvailabilityModel = {};

    describe("A Payment Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.bank");
            module("app.components.payment");

            // mock dependencies
            PaymentsResource = jasmine.createSpyObj("PaymentsResource", ["addPayment", "getPaymentAddAvailability", "getPayments"]);
            mockPaymentAddAvailability = jasmine.createSpyObj("PaymentAddAvailabilityModel", ["PaymentAddAvailabilityModel", "set"]);

            module(function ($provide) {
                $provide.value("PaymentsResource", PaymentsResource);
            });

            remotePaymentAddAvailabilityModel = jasmine.createSpyObj("PaymentAddAvailabilityModel", ["PaymentAddAvailabilityModel", "set"]);

            inject(function (_$q_, _$rootScope_, globals, _moment_, _BankModel_, _PaymentManager_, _PaymentModel_, PaymentAddAvailabilityModel) {
                remotePaymentAddAvailabilityModel = new PaymentAddAvailabilityModel();

                $q = _$q_;
                $rootScope = _$rootScope_;
                moment = _moment_;
                BankModel = _BankModel_;
                PaymentManager = _PaymentManager_;
                PaymentModel = _PaymentModel_;
                PaymentManager.setPaymentAddAvailability(mockPaymentAddAvailability);
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            paymentModel1 = TestUtils.getRandomPayment(PaymentModel, BankModel);
            paymentModel2 = TestUtils.getRandomPayment(PaymentModel, BankModel);
            paymentModel3 = TestUtils.getRandomPayment(PaymentModel, BankModel);

            mockPaymentCollection = {};
            mockPaymentCollection[paymentModel1.id] = paymentModel1;
            mockPaymentCollection[paymentModel2.id] = paymentModel2;
            mockPaymentCollection[paymentModel3.id] = paymentModel3;
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function() {
                PaymentManager.setPaymentAddAvailability(mockPaymentAddAvailability);
                $rootScope.$broadcast("userLoggedOut");
            });

            it("should reset the payment add availability", function () {
                expect(PaymentManager.getPaymentAddAvailability()).not.toEqual(mockPaymentAddAvailability);
            });

        });

        describe("has an addPayment function that", function () {

            var addPaymentDeferred,
                mockPaymentToAdd,
                mockResponse = {
                    data: {
                        id                : "id value",
                        scheduledDate     : "scheduledDate value",
                        amount            : "amount value",
                        bankAccount       : {
                            id            : "bank id value",
                            defaultBank   : true,
                            name          : "company name value"
                        },
                        status            : "status value",
                        confirmationNumber: "confirmationNumber value"
                    }
                };


            beforeEach(function () {
                mockPaymentToAdd = TestUtils.getRandomPaymentAdd(PaymentModel, BankModel);
                addPaymentDeferred = $q.defer();

                PaymentsResource.addPayment.and.returnValue(addPaymentDeferred.promise);

                PaymentManager.addPayment(accountId, mockPaymentToAdd)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call PaymentsResource.addPayment", function () {
                expect(PaymentsResource.addPayment).toHaveBeenCalledWith(accountId, {
                    amount: mockPaymentToAdd.amount,
                    bankAccountId: mockPaymentToAdd.bankAccount.id,
                    scheduledDate: moment(mockPaymentToAdd.scheduledDate).toISOString()
                });
            });

            describe("when the payment is added successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        addPaymentDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        var expectedResult = new PaymentModel();
                        expectedResult.set(mockResponse.data);

                        expect(resolveHandler).toHaveBeenCalledWith(expectedResult);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        addPaymentDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when adding the payment fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    addPaymentDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

            });

        });

        describe("has a fetchPaymentAddAvailability function that", function () {

            var getPaymentAddAvailabilityModelDeferred,
                mockResponse = {
                data: {
                    makePaymentAllowed                    : "false",
                    shouldDisplayBankAccountSetupMessage  : "true",
                    shouldDisplayDirectDebitEnabledMessage: "false",
                    shouldDisplayOutstandingPaymentMessage: "true"
                }
            };


            beforeEach(function () {
                getPaymentAddAvailabilityModelDeferred = $q.defer();

                PaymentsResource.getPaymentAddAvailability.and.returnValue(getPaymentAddAvailabilityModelDeferred.promise);
                spyOn(PaymentManager, "getPaymentAddAvailability").and.returnValue(mockPaymentAddAvailability);

                PaymentManager.fetchPaymentAddAvailability(accountId)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting a details of the payment add availability", function () {

                it("should call PaymentsResource.getPaymentAddAvailability", function () {
                    expect(PaymentsResource.getPaymentAddAvailability).toHaveBeenCalledWith(accountId);
                });

            });

            describe("when the payment add availability is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getPaymentAddAvailabilityModelDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the payment add availability", function () {
                        expect(mockPaymentAddAvailability.set).toHaveBeenCalledWith(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
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
                        expect(mockPaymentAddAvailability.set).not.toHaveBeenCalled();
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
                    expect(mockPaymentAddAvailability.set).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a fetchPayments function that", function () {

            var getPaymentsDeferred;

            beforeEach(function () {
                getPaymentsDeferred = $q.defer();

                PaymentsResource.getPayments.and.returnValue(getPaymentsDeferred.promise);

                PaymentManager.fetchPayments(accountId, pageNumber, pageSize)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting the payments", function () {

                it("should call PaymentsResource.getPayments", function () {
                    expect(PaymentsResource.getPayments).toHaveBeenCalledWith(accountId, {
                        pageNumber: pageNumber,
                        pageSize  : pageSize
                    });
                });

            });

            describe("when the payments are fetched successfully", function () {

                var mockRemoteBanks = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteBanks.data = _.values(mockPaymentCollection);
                        getPaymentsDeferred.resolve(mockRemoteBanks);

                        PaymentsResource.getPayments.and.returnValue(getPaymentsDeferred.promise);

                        PaymentManager.fetchPayments(accountId, pageNumber, pageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockPaymentCollection);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getPaymentsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when retrieving the payments fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getPaymentsDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
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