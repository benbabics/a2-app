(function () {
    "use strict";

    var CACHE_KEY_PENDING = "transactions.pending",
        CACHE_KEY_POSTED = "transactions.posted",
        $rootScope,
        $q,
        resolveHandler,
        rejectHandler,
        PostedTransactionModel,
        TransactionsResource,
        TransactionManager,
        WexCache,
        mockPostedTransactionsCollection,
        mockCachedPostedTransactionsCollection;

    describe("A Transaction Manager", function () {

        beforeEach(function () {

            // mock dependencies
            TransactionsResource = jasmine.createSpyObj("TransactionsResource", ["getPendingTransactions", "getPostedTransactions"]);

            WexCache = jasmine.createSpyObj("WexCache", [
                "clearPropertyValue",
                "mergePropertyValue",
                "readPropertyValue"
            ]);

            module(function ($provide) {
                $provide.value("TransactionsResource", TransactionsResource);
                $provide.value("WexCache", WexCache);
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
                TransactionManager.clearCachedValues();
            });

            it("should reset the cached posted transactions", function () {
                expect(WexCache.clearPropertyValue).toHaveBeenCalledWith(CACHE_KEY_POSTED);
            });

            it("should reset the cached pending transactions", function () {
                expect(WexCache.clearPropertyValue).toHaveBeenCalledWith(CACHE_KEY_PENDING);
            });
        });

        describe("has a fetchPostedTransaction function that", function () {
            var postedTransactionToFetch,
                fetchedPostedTransaction;

            describe("when there are cached posted transactions", function () {

                beforeEach(function () {
                    WexCache.readPropertyValue.and.returnValue(mockPostedTransactionsCollection);
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

            describe("when there are NOT any cached posted transactions", function () {

                beforeEach(function () {
                    WexCache.readPropertyValue.and.returnValue([]);
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
                mockFilterValue,
                mockFromDate,
                mockToDate,
                mockPageNumber,
                mockPageSize,
                mockFilterBy;

            beforeEach(function () {
                getPendingTransactionsDeferred = $q.defer();
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockCardId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockFilterValue = TestUtils.getRandomStringThatIsAlphaNumeric(2);
                mockFromDate = TestUtils.getRandomDate();
                mockToDate = TestUtils.getRandomDate();
                mockPageNumber = TestUtils.getRandomNumberWithLength(1);
                mockPageSize = TestUtils.getRandomNumberWithLength(2);
                mockFilterBy = "card";

                TransactionsResource.getPendingTransactions.and.returnValue(getPendingTransactionsDeferred.promise);
            });

            describe("when getting the pending transactions", function () {

                describe("with a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize, mockFilterBy, mockFilterValue, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                            cardId:      mockCardId,
                            fromDate:    mockFromDate,
                            toDate:      mockToDate,
                            pageNumber:  mockPageNumber,
                            pageSize:    mockPageSize,
                            filterBy:    mockFilterBy,
                            filterValue: mockFilterValue
                        });
                    });
                });

                describe("without a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize, mockFilterBy, mockFilterValue)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                          fromDate:    mockFromDate,
                          toDate:      mockToDate,
                          pageNumber:  mockPageNumber,
                          pageSize:    mockPageSize,
                          filterBy:    mockFilterBy,
                          filterValue: mockFilterValue
                        });
                    });
                });

                describe("with a filterValue", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize, mockFilterBy, mockFilterValue, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                            cardId:      mockCardId,
                            fromDate:    mockFromDate,
                            toDate:      mockToDate,
                            pageNumber:  mockPageNumber,
                            pageSize:    mockPageSize,
                            filterBy:    mockFilterBy,
                            filterValue: mockFilterValue
                        });
                    });
                });

                describe("without a filterValue", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPendingTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPendingTransactions", function () {
                        expect(TransactionsResource.getPendingTransactions).toHaveBeenCalledWith(mockAccountId, {
                          fromDate:    mockFromDate,
                          toDate:      mockToDate,
                          pageNumber:  mockPageNumber,
                          pageSize:    mockPageSize,
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

                TransactionsResource.getPostedTransactions.and.returnValue(getPostedTransactionsDeferred.promise);
            });

            describe("when getting the posted transactions", function () {

                describe("with a cardId", function () {

                    beforeEach(function () {
                        TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize, null, null, mockCardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should call TransactionsResource.getPostedTransactions", function () {
                        expect(TransactionsResource.getPostedTransactions).toHaveBeenCalledWith(mockAccountId, {
                            cardId     : mockCardId,
                            fromDate   : mockFromDate,
                            toDate     : mockToDate,
                            pageNumber : mockPageNumber,
                            pageSize   : mockPageSize,
                            filterBy   : null,
                            filterValue: null
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

                        it("should merge the values into the cache", function () {
                            expect(WexCache.mergePropertyValue).toHaveBeenCalledWith(CACHE_KEY_POSTED, mockPostedTransactions.data, {mergeBy: "transactionId"});
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

                        it("should merge the values into the cache", function () {
                            expect(WexCache.mergePropertyValue).toHaveBeenCalledWith(CACHE_KEY_POSTED, mockPostedTransactions.data, {mergeBy: "transactionId"});
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

                    it("should NOT merge the values into the cache", function () {
                        expect(WexCache.mergePropertyValue).not.toHaveBeenCalled();
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

        describe("has a getCachedPostedTransactions function that", function () {

            beforeEach(function () {
                WexCache.readPropertyValue.and.returnValue(mockPostedTransactionsCollection);
            });

            it("should return the cached posted transactions", function () {
                var result = TransactionManager.getCachedPostedTransactions();

                expect(WexCache.readPropertyValue).toHaveBeenCalledWith(CACHE_KEY_POSTED);
                expect(result).toEqual(mockPostedTransactionsCollection);
            });
        });

        describe("has a getCachedPendingTransactions function that", function () {

            beforeEach(function () {
                WexCache.readPropertyValue.and.returnValue(mockPostedTransactionsCollection);
            });

            it("should return the cached pending transactions", function () {
                var result = TransactionManager.getCachedPendingTransactions();

                expect(WexCache.readPropertyValue).toHaveBeenCalledWith(CACHE_KEY_PENDING);
                expect(result).toEqual(mockPostedTransactionsCollection);
            });
        });
    });
})();
