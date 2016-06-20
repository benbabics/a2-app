(function () {
    "use strict";

    var $rootScope,
        $q,
        resolveHandler,
        rejectHandler,
        PostedTransactionModel,
        TransactionsResource,
        TransactionManager,
        mockPostedTransactionsCollection,
        mockCachedPostedTransactionsCollection;

    describe("A Transaction Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.transaction");

            // mock dependencies
            TransactionsResource = jasmine.createSpyObj("TransactionsResource", ["getPendingTransactions", "getPostedTransactions"]);

            module(function ($provide) {
                $provide.value("TransactionsResource", TransactionsResource);
            });

            inject(function (_$q_, _$rootScope_, _TransactionManager_, _PostedTransactionModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                TransactionManager = _TransactionManager_;
                PostedTransactionModel = _PostedTransactionModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            var numModels, i;

            mockPostedTransactionsCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockPostedTransactionsCollection.push(TestUtils.getRandomPostedTransaction(PostedTransactionModel));
            }

            mockCachedPostedTransactionsCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockCachedPostedTransactionsCollection.push(TestUtils.getRandomPostedTransaction(PostedTransactionModel));
            }
        });

        describe("has an activate function that", function () {
            // TODO: figure out how to test this
        });

        describe("has a clearCachedValues function that", function () {

            beforeEach(function () {
                TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                TransactionManager.clearCachedValues();
            });

            it("should reset the cached posted transactions", function () {
                expect(TransactionManager.getPostedTransactions()).toEqual([]);
            });
        });

        describe("has a fetchPostedTransaction function that", function () {
            var postedTransactionToFetch,
                fetchedPostedTransaction;

            describe("when postedTransactions is NOT empty", function () {

                beforeEach(function () {
                    TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                });

                describe("when the posted transaction to fetch is in the list", function () {

                    beforeEach(function () {
                        postedTransactionToFetch = TestUtils.getRandomValueFromArray(mockPostedTransactionsCollection);

                        TransactionManager.fetchPostedTransaction(postedTransactionToFetch.transactionId)
                            .then(function (postedTransaction) {
                                fetchedPostedTransaction = postedTransaction;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return the expected posted transaction", function () {
                        expect(fetchedPostedTransaction).toEqual(postedTransactionToFetch);
                    });

                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when the posted transaction to fetch is NOT in the list", function () {

                    beforeEach(function () {
                        postedTransactionToFetch = TestUtils.getRandomPostedTransaction(PostedTransactionModel);

                        TransactionManager.fetchPostedTransaction(postedTransactionToFetch.transactionId)
                            .then(function (postedTransaction) {
                                fetchedPostedTransaction = postedTransaction;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return undefined", function () {
                        expect(fetchedPostedTransaction).toBeUndefined();
                    });

                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when payments is empty", function () {

                beforeEach(function () {
                    TransactionManager.setPostedTransactions([]);
                });

                beforeEach(function () {
                    postedTransactionToFetch = TestUtils.getRandomValueFromArray(mockPostedTransactionsCollection);

                    TransactionManager.fetchPostedTransaction(postedTransactionToFetch.transactionId)
                        .then(function (postedTransaction) {
                            fetchedPostedTransaction = postedTransaction;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should return undefined", function () {
                    expect(fetchedPostedTransaction).toBeUndefined();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a fetchPendingTransactions function that", function () {
            var getPendingTransactionsDeferred,
                mockAccountId,
                mockCardId,
                mockFilterValue;

            beforeEach(function () {
                getPendingTransactionsDeferred = $q.defer();
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockCardId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockFilterValue = TestUtils.getRandomStringThatIsAlphaNumeric(2);

                TransactionsResource.getPendingTransactions.and.returnValue(getPendingTransactionsDeferred.promise);
            });

            describe("when getting the pending transactions", function () {

                describe("with a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                            cardId: mockCardId
                        });
                    });
                });

                describe("without a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {});
                    });
                });

                describe("with a filterValue", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockCardId, mockFilterValue)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                            cardId: mockCardId,
                            filterValue: mockFilterValue
                        });
                    });
                });

                describe("without a filterValue", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                          cardId: mockCardId
                        });
                    });
                });
            });
        });

        describe("has a fetchPostedTransactions function that", function () {
            var getPostedTransactionsDeferred,
                mockAccountId,
                mockFromDate,
                mockToDate,
                mockPageNumber,
                mockPageSize,
                mockCardId;

            beforeEach(function () {
                getPostedTransactionsDeferred = $q.defer();
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockFromDate = TestUtils.getRandomDate();
                mockToDate = TestUtils.getRandomDate();
                mockPageNumber = TestUtils.getRandomInteger(0, 10);
                mockPageSize = TestUtils.getRandomInteger(1, 100);
                mockCardId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                TransactionManager.setPostedTransactions(mockCachedPostedTransactionsCollection.slice());

                TransactionsResource.getPostedTransactions.and.returnValue(getPostedTransactionsDeferred.promise);
            });

            describe("when getting the posted transactions", function () {

                describe("with a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPostedTransactions", function () {
                        expect(TransactionsResource.getPostedTransactions).toHaveBeenCalledWith(mockAccountId, {
                            fromDate  : mockFromDate,
                            toDate    : mockToDate,
                            pageNumber: mockPageNumber,
                            pageSize  : mockPageSize,
                            cardId    : mockCardId
                        });
                    });
                });

                describe("without a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPostedTransactions", function () {
                        expect(TransactionsResource.getPostedTransactions).toHaveBeenCalledWith(mockAccountId, {
                            fromDate  : mockFromDate,
                            toDate    : mockToDate,
                            pageNumber: mockPageNumber,
                            pageSize  : mockPageSize
                        });
                    });
                });
            });

            describe("when the posted transactions are fetched successfully", function () {
                var mockPostedTransactions = {data: {}};

                beforeEach(function () {
                    mockPostedTransactions.data = mockPostedTransactionsCollection.slice();
                });

                describe("when there is data in the response", function () {

                    describe("when the first page is requested", function () {

                        beforeEach(function () {
                            mockPageNumber = 0;

                            TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            getPostedTransactionsDeferred.resolve(mockPostedTransactions);

                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(mockPostedTransactions.data);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        it("should reset postedTransactions to an array of models set from the data", function () {
                            expect(TransactionManager.getPostedTransactions()).toEqual(mockPostedTransactionsCollection);
                        });
                    });

                    describe("when a page beyond the first page requested", function () {

                        beforeEach(function () {
                            mockPageNumber = TestUtils.getRandomInteger(1, 10);

                            TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        describe("when there are transactions in the fetched data that are already cached", function () {

                            beforeEach(function () {
                                Array.prototype.push.apply(mockPostedTransactions.data, mockCachedPostedTransactionsCollection);

                                getPostedTransactionsDeferred.resolve(mockPostedTransactions);

                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockPostedTransactions.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add only the uncached transactions from the data to postedTransactions", function () {
                                var expectedValues = _.uniqBy(mockCachedPostedTransactionsCollection.concat(mockPostedTransactions.data), "transactionId");

                                expect(TransactionManager.getPostedTransactions()).toEqual(expectedValues);
                            });
                        });

                        describe("when there are no transactions in the fetched data that are already cached", function () {

                            beforeEach(function () {
                                getPostedTransactionsDeferred.resolve(mockPostedTransactions);

                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockPostedTransactions.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add all of the fetched transactions to postedTransactions", function () {
                                expect(TransactionManager.getPostedTransactions()).toEqual(mockCachedPostedTransactionsCollection.concat(mockPostedTransactions.data));
                            });
                        });
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    beforeEach(function () {
                        getPostedTransactionsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT modify postedTransactions", function () {
                        expect(TransactionManager.getPostedTransactions()).toEqual(mockCachedPostedTransactionsCollection);
                    });
                });
            });

            describe("when retrieving the posted transactions fails", function () {
                var mockResponse = "Some error";

                beforeEach(function () {
                    TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                beforeEach(function () {
                    getPostedTransactionsDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });
            });

        });

        describe("has a getPostedTransactions function that", function () {

            it("should return the posted transactions passed to setPostedTransactions", function () {
                var result;

                TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                result = TransactionManager.getPostedTransactions();

                expect(result).toEqual(mockPostedTransactionsCollection);
            });

            // TODO: figure out how to test this without using setPostedTransactions
        });

        describe("has a setPostedTransactions function that", function () {

            it("should update the posted transactions returned by getPostedTransactions", function () {
                var result;

                TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                result = TransactionManager.getPostedTransactions();

                expect(result).toEqual(mockPostedTransactionsCollection);
            });

            // TODO: figure out how to test this without using getPostedTransactions
        });
    });
})();
