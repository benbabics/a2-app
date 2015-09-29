(function () {
    "use strict";

    var $q,
        $rootScope,
        accountId = TestUtils.getRandomStringThatIsAlphaNumeric(10),
        moment,
        pageNumber = TestUtils.getRandomNumberWithLength(1),
        pageSize = TestUtils.getRandomNumberWithLength(2),
        paymentId = TestUtils.getRandomStringThatIsAlphaNumeric(5),
        resolveHandler,
        rejectHandler,
        BankModel,
        PaymentManager,
        PaymentModel,
        PaymentsResource,
        mockPaymentAddAvailability = {},
        mockPaymentCollection,
        remotePaymentAddAvailabilityModel = {},
        mockGlobals = {
            PAYMENT_LIST: {
                SEARCH_OPTIONS: {
                    PAGE_NUMBER: TestUtils.getRandomInteger(0, 100),
                    PAGE_SIZE  : TestUtils.getRandomInteger(1, 100)
                }
            },

            PAYMENT: {
                STATUS: {
                    SCHEDULED: "scheduled"
                }
            }
        };

    describe("A Payment Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.bank");
            module("app.components.payment");

            // mock dependencies
            PaymentsResource = jasmine.createSpyObj("PaymentsResource", [
                "addPayment",
                "deletePayment",
                "getPaymentAddAvailability",
                "getPayments",
                "getPayment",
                "postPayment"
            ]);
            mockPaymentAddAvailability = jasmine.createSpyObj("PaymentAddAvailabilityModel", ["PaymentAddAvailabilityModel", "set"]);

            module(function ($provide, sharedGlobals) {
                $provide.value("PaymentsResource", PaymentsResource);
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
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
            var numModels, i;

            mockPaymentCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockPaymentCollection.push(TestUtils.getRandomPayment(PaymentModel, BankModel));
            }
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function () {
                PaymentManager.setPaymentAddAvailability(mockPaymentAddAvailability);
                PaymentManager.setPayments(mockPaymentCollection);
                $rootScope.$broadcast("userLoggedOut");
            });

            it("should reset the payment add availability", function () {
                expect(PaymentManager.getPaymentAddAvailability()).not.toEqual(mockPaymentAddAvailability);
            });

            it("should reset the payments", function () {
                expect(PaymentManager.getPayments()).toEqual([]);
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
                            id         : "bank id value",
                            defaultBank: true,
                            name       : "company name value"
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
                    amount       : mockPaymentToAdd.amount,
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

        describe("has a fetchPayment function that", function () {
            var fetchedPayment,
                paymentToFetch;

            describe("when payments is NOT empty", function () {

                beforeEach(function () {
                    paymentToFetch = TestUtils.getRandomValueFromArray(mockPaymentCollection);
                    PaymentManager.setPayments(mockPaymentCollection);
                });

                describe("when the payment to fetch is in the list", function () {

                    beforeEach(function () {
                        PaymentManager.fetchPayment(paymentToFetch.id)
                            .then(function (paymentFound) {
                                fetchedPayment = paymentFound;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return the expected payment", function () {
                        expect(fetchedPayment).toEqual(paymentToFetch);
                    });


                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when the payment to fetch is NOT in the list", function () {

                    beforeEach(function () {
                        PaymentManager.fetchPayment(paymentId)
                            .then(function (paymentFound) {
                                fetchedPayment = paymentFound;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return undefined", function () {
                        expect(fetchedPayment).toBeUndefined();
                    });


                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

            });

            describe("when payments is empty", function () {

                beforeEach(function () {
                    PaymentManager.setPayments([]);

                    PaymentManager.fetchPayment(paymentId)
                        .then(function (paymentFound) {
                            fetchedPayment = paymentFound;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should return undefined", function () {
                    expect(fetchedPayment).toBeUndefined();
                });


                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
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

                var mockRemotePayments = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemotePayments.data = mockPaymentCollection.slice();
                        getPaymentsDeferred.resolve(mockRemotePayments);

                        PaymentsResource.getPayments.and.returnValue(getPaymentsDeferred.promise);

                        PaymentManager.fetchPayments(accountId, pageNumber, pageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should set the payments", function () {
                        expect(PaymentManager.getPayments()).toEqual(mockPaymentCollection);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockRemotePayments.data);
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

        describe("has a fetchScheduledPaymentsCount function that", function () {
            var getPaymentsDeferred;

            beforeEach(function () {
                getPaymentsDeferred = $q.defer();

                PaymentsResource.getPayments.and.returnValue(getPaymentsDeferred.promise);

                PaymentManager.fetchScheduledPaymentsCount(accountId)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call PaymentsResource.getPayments with the expected values", function () {
                expect(PaymentsResource.getPayments).toHaveBeenCalledWith(accountId, jasmine.objectContaining({
                    pageNumber: mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                    pageSize  : mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE
                }));
            });

            describe("when the payments are fetched successfully", function () {
                var mockRemotePayments = {
                        data: {}
                    },
                    numScheduledPayments = 0,
                    numNonScheduledPayments = 0,
                    mockScheduledPayments = [],
                    mockNonScheduledPayments = [];

                describe("when there is a valid response", function () {

                    describe("when the response contains scheduled payments", function () {

                        beforeEach(function () {
                            var curPayment, i;

                            numScheduledPayments = TestUtils.getRandomInteger(1, 100);
                            for (i = 0; i < numScheduledPayments; ++i) {
                                curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                                curPayment.status = mockGlobals.PAYMENT.STATUS.SCHEDULED;

                                mockScheduledPayments.push(curPayment);
                            }

                            numNonScheduledPayments = TestUtils.getRandomInteger(1, 100);
                            for (i = 0; i < numNonScheduledPayments; ++i) {
                                curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                                curPayment.status = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                                mockNonScheduledPayments.push(curPayment);
                            }

                            mockRemotePayments.data = _.values(angular.extend({}, mockNonScheduledPayments, mockScheduledPayments));
                            getPaymentsDeferred.resolve(mockRemotePayments);

                            $rootScope.$digest();
                        });

                        it("should resolve with the expected value", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(numScheduledPayments);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the response contains no scheduled payments", function () {

                        beforeEach(function () {
                            mockRemotePayments.data = _.values(mockNonScheduledPayments);
                            getPaymentsDeferred.resolve(mockRemotePayments);

                            $rootScope.$digest();
                        });

                        it("should resolve with 0", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(0);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when there is no valid response", function () {

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

        describe("has a getPayments function that", function () {

            it("should return the payments passed to setPayments", function () {
                var result;

                PaymentManager.setPayments(mockPaymentCollection);
                result = PaymentManager.getPayments();

                expect(result).toEqual(mockPaymentCollection);
            });

            // TODO: figure out how to test this without using setPayments
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
            });

            // TODO: figure out how to test this without using setPaymentAddAvailability
        });

        describe("has an isPaymentEditable function that", function () {

            var actualResult,
                getPaymentsDeferred;

            beforeEach(function () {
                getPaymentsDeferred = $q.defer();
                PaymentsResource.getPayments.and.returnValue(getPaymentsDeferred.promise);
            });

            describe("when the payment NOT is scheduled", function () {

                beforeEach(function () {
                    var paymentToCheck = TestUtils.getRandomPayment(PaymentModel, BankModel);

                    PaymentManager.isPaymentEditable(accountId, paymentToCheck)
                        .then(function (isPaymentEditable) {
                            actualResult = isPaymentEditable;
                        })
                        .catch(rejectHandler);
                });

                it("should NOT call PaymentsResource.getPayments", function () {
                    expect(PaymentsResource.getPayments).not.toHaveBeenCalled();
                });

                it("should resolve with false", function () {
                    expect(actualResult).toBeFalsy();
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

            describe("when the payment is scheduled", function () {

                var mockRemotePayments = {
                        data: {}
                    },
                    numScheduledPayments = 0,
                    numNonScheduledPayments = 0,
                    mockScheduledPayments = [],
                    mockNonScheduledPayments = [];

                beforeEach(function () {
                    var paymentToCheck = TestUtils.getRandomPayment(PaymentModel, BankModel);
                    paymentToCheck.status = "SCHEDULED";

                    PaymentManager.isPaymentEditable(accountId, paymentToCheck)
                        .then(function (isPaymentEditable) {
                            actualResult = isPaymentEditable;
                        })
                        .catch(rejectHandler);
                });

                it("should call PaymentsResource.getPayments with the expected values", function () {
                    expect(PaymentsResource.getPayments).toHaveBeenCalledWith(accountId, jasmine.objectContaining({
                        pageNumber: mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                        pageSize  : mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE
                    }));
                });

                describe("when there are no scheduled payments retrieved", function () {

                    beforeEach(function () {
                        var curPayment, i;

                        mockScheduledPayments = [];
                        mockNonScheduledPayments = [];

                        numNonScheduledPayments = TestUtils.getRandomInteger(1, 100);
                        for (i = 0; i < numNonScheduledPayments; ++i) {
                            curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                            curPayment.status = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            mockNonScheduledPayments.push(curPayment);
                        }

                        mockRemotePayments.data = _.values(numNonScheduledPayments);
                        getPaymentsDeferred.resolve(mockRemotePayments);

                        $rootScope.$digest();
                    });

                    it("should resolve with false", function () {
                        expect(actualResult).toBeFalsy();
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is only 1 scheduled payment", function () {

                    beforeEach(function () {
                        var curPayment, i;

                        mockScheduledPayments = [];
                        mockNonScheduledPayments = [];

                        curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                        curPayment.status = mockGlobals.PAYMENT.STATUS.SCHEDULED;

                        mockScheduledPayments.push(curPayment);

                        numNonScheduledPayments = TestUtils.getRandomInteger(1, 100);
                        for (i = 0; i < numNonScheduledPayments; ++i) {
                            curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                            curPayment.status = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            mockNonScheduledPayments.push(curPayment);
                        }

                        mockRemotePayments.data = _.values(angular.extend({}, mockNonScheduledPayments, mockScheduledPayments));
                        getPaymentsDeferred.resolve(mockRemotePayments);

                        $rootScope.$digest();
                    });

                    it("should resolve with true", function () {
                        expect(actualResult).toBeTruthy();
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there are multiple scheduled payments", function () {

                    beforeEach(function () {
                        var curPayment, i;

                        mockScheduledPayments = [];
                        mockNonScheduledPayments = [];

                        numScheduledPayments = TestUtils.getRandomInteger(2, 100);
                        for (i = 0; i < numScheduledPayments; ++i) {
                            curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                            curPayment.status = mockGlobals.PAYMENT.STATUS.SCHEDULED;

                            mockScheduledPayments.push(curPayment);
                        }

                        numNonScheduledPayments = TestUtils.getRandomInteger(1, 100);
                        for (i = 0; i < numNonScheduledPayments; ++i) {
                            curPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                            curPayment.status = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            mockNonScheduledPayments.push(curPayment);
                        }

                        mockRemotePayments.data = _.values(angular.extend({}, mockNonScheduledPayments, mockScheduledPayments));
                        getPaymentsDeferred.resolve(mockRemotePayments);

                        $rootScope.$digest();
                    });

                    it("should return false", function () {
                        expect(actualResult).toBeFalsy(false);
                    });

                });

            });

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
            });

            // TODO: figure out how to test this without using getPaymentAddAvailability
        });

        describe("has a setPayments function that", function () {

            it("should update the payments returned by getPayments", function () {
                var result;

                PaymentManager.setPayments(mockPaymentCollection);
                result = PaymentManager.getPayments();

                expect(result).toEqual(mockPaymentCollection);
            });

            // TODO: figure out how to test this without using getPayments
        });

        describe("has an updatePayment function that", function () {

            var postPaymentDeferred,
                mockPaymentToUpdate,
                mockResponse = {
                    data: {
                        id                : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        scheduledDate     : TestUtils.getRandomDate(),
                        amount            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        bankAccount       : {
                            id         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            defaultBank: TestUtils.getRandomBoolean(),
                            name       : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        status            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        confirmationNumber: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                };


            beforeEach(function () {
                mockPaymentToUpdate = TestUtils.getRandomPaymentUpdate(PaymentModel, BankModel);
                postPaymentDeferred = $q.defer();

                PaymentsResource.postPayment.and.returnValue(postPaymentDeferred.promise);

                PaymentManager.updatePayment(accountId, mockPaymentToUpdate)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call PaymentsResource.postPayment", function () {
                expect(PaymentsResource.postPayment).toHaveBeenCalledWith(accountId, mockPaymentToUpdate.id, {
                    amount       : mockPaymentToUpdate.amount,
                    bankAccountId: mockPaymentToUpdate.bankAccount.id,
                    scheduledDate: moment(mockPaymentToUpdate.scheduledDate).toISOString()
                });
            });

            describe("when the payment is posted successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        postPaymentDeferred.resolve(mockResponse);
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
                        postPaymentDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when updating the payment fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    postPaymentDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

            });

        });

        describe("has a removePayment function that", function () {

            var deletePaymentDeferred,
                paymentToRemove;

            beforeEach(function () {
                paymentToRemove = TestUtils.getRandomValueFromArray(mockPaymentCollection);
                PaymentManager.setPayments(mockPaymentCollection);
                deletePaymentDeferred = $q.defer();

                PaymentsResource.deletePayment.and.returnValue(deletePaymentDeferred.promise);

                PaymentManager.removePayment(accountId, paymentToRemove.id)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call PaymentsResource.deletePayment", function () {
                expect(PaymentsResource.deletePayment).toHaveBeenCalledWith(accountId, paymentToRemove.id);
            });

            describe("when the payment is deleted successfully", function () {

                var mockResponse;

                beforeEach(function () {
                    deletePaymentDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(mockResponse);
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should remove the payment from the collection", function () {
                    expect(_.find(PaymentManager.getPayments(), { "id": paymentToRemove.id })).toBeUndefined();
                });
            });

            describe("when deleting the payment fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    deletePaymentDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT remove the payment from the collection", function () {
                    expect(_.find(PaymentManager.getPayments(), { "id": paymentToRemove.id })).toEqual(paymentToRemove);
                });

            });

        });

    });

})();