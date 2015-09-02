(function () {
    "use strict";

    var $rootScope,
        $q,
        resolveHandler,
        rejectHandler,
        PostedTransactionModel,
        TransactionsResource,
        TransactionManager,
        mockPostedTransactionsCollection;

    describe("A Transaction Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.transaction");

            // mock dependencies
            TransactionsResource = jasmine.createSpyObj("TransactionsResource", ["getPostedTransactions"]);

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
            mockPostedTransactionsCollection = [];
            var numModels = TestUtils.getRandomInteger(1, 100);
            for (var i = 0; i < numModels; ++i) {
                mockPostedTransactionsCollection.push(TestUtils.getRandomPostedTransaction(PostedTransactionModel));
            }
        });

        describe("has an activate function that", function () {
            // TODO: figure out how to test this
        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function () {
                TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                $rootScope.$broadcast("userLoggedOut");
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

        describe("has a fetchPostedTransactions function that", function () {
            var getPostedTransactionsDeferred,
                mockAccountId,
                mockFromDate,
                mockToDate,
                mockPageNumber,
                mockPageSize;

            beforeEach(function () {
                getPostedTransactionsDeferred = $q.defer();
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockFromDate = TestUtils.getRandomDate();
                mockToDate = TestUtils.getRandomDate();
                mockPageNumber = TestUtils.getRandomInteger(0, 10);
                mockPageSize = TestUtils.getRandomInteger(1, 100);

                TransactionManager.setPostedTransactions([]);

                TransactionsResource.getPostedTransactions.and.returnValue(getPostedTransactionsDeferred.promise);

                TransactionManager.fetchPostedTransactions(mockAccountId, mockFromDate, mockToDate, mockPageNumber, mockPageSize)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting the posted transactions", function () {

                it("should call TransactionsResource.getPostedTransactions", function () {
                    expect(TransactionsResource.getPostedTransactions).toHaveBeenCalledWith(mockAccountId, {
                        fromDate  : mockFromDate,
                        toDate    : mockToDate,
                        pageNumber: mockPageNumber,
                        pageSize  : mockPageSize
                    });
                });
            });

            describe("when the posted transactions are fetched successfully", function () {
                var mockPostedTransactions = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockPostedTransactions.data = mockPostedTransactionsCollection;
                        getPostedTransactionsDeferred.resolve(mockPostedTransactions);

                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockPostedTransactionsCollection);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should set postedTransactions to an array of models from the data", function () {
                        expect(TransactionManager.getPostedTransactions()).toEqual(mockPostedTransactionsCollection);
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getPostedTransactionsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT set postedTransactions", function () {
                        expect(TransactionManager.getPostedTransactions()).toEqual([]);
                    });
                });
            });

            describe("when retrieving the posted transactions fails", function () {
                var mockResponse = "Some error";

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

            // TODO: figure out how to test this without using setPayments
        });

        describe("has a setPostedTransactions function that", function () {

            it("should update the posted transactions returned by getPostedTransactions", function () {
                var result;

                TransactionManager.setPostedTransactions(mockPostedTransactionsCollection);
                result = TransactionManager.getPostedTransactions();

                expect(result).toEqual(mockPostedTransactionsCollection);
            });

            // TODO: figure out how to test this without using getPayments
        });
    });
})();