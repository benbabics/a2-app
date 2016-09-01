(function () {
    "use strict";

    describe("A Transaction Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockPostedTransaction,
            TransactionManager,
            AnalyticsUtil,
            CardManager,
            DriverManager,
            CardModel,
            DriverModel,
            mockGlobals = {
                TRANSACTION_LIST: {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },
                POSTED_TRANSACTION_DETAIL: {
                    "CONFIG": {
                        "ANALYTICS"           : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "cardNumber"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "customVehicleAssetId": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "driverFirstName"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "driverLastName"      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "grossCost"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "merchantName"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "merchantCityState"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "netCost"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "postedDate"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "productDescription"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "transactionDate"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "transactionId"       : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            };

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.driver");
            module("app.components.transaction");
            module("app.html");

            // mock dependencies
            TransactionManager = jasmine.createSpyObj("TransactionManager", ["fetchPostedTransaction"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["trackView"]);
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCard"]);
            DriverManager = jasmine.createSpyObj("DriverManager", ["fetchDriver"]);

            module(function ($provide, sharedGlobals) {
                $provide.value("TransactionManager", TransactionManager);
                $provide.value("CardManager", CardManager);
                $provide.value("DriverManager", DriverManager);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, _CardModel_, _DriverModel_, PostedTransactionModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                CardModel = _CardModel_;
                DriverModel = _DriverModel_;

                mockPostedTransaction = TestUtils.getRandomPostedTransaction(PostedTransactionModel);
            });
        });

        describe("has a transaction state that", function () {
            var state,
                stateName = "transaction";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function() {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/transaction");
            });

            it("should define a view on the root container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });

        describe("has a transaction.list state that", function () {
            var state,
                stateName = "transaction.list";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should be cached", function () {
                expect(state.cache).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/list/:cardId");
            });

            it("should respond to the URL without a cardId", function () {
                expect($state.href(stateName)).toEqual("#/transaction/list/");
            });

            it("should respond to the URL with a cardId", function () {
                expect($state.href(stateName, {cardId: "1234"})).toEqual("#/transaction/list/1234");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.TRANSACTION_LIST.CONFIG.ANALYTICS.pageName);
                });

            });

        });

        describe("has a transaction.filterBy state that", function () {
            var state,
                stateName = "transaction.filterBy";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/filter/:filterBy/:filterValue");
            });

            it("should respond to the URL", function () {
                var params = {
                    filterBy:    "card",
                    filterValue: "7890"
                },
                segments = params.filterBy + "/" + params.filterValue;

                expect($state.href(stateName, params)).toEqual("#/transaction/filter/" + segments);
            });

            describe("when navigated to", function () {
                var params;

                beforeEach(function () {
                    params = {};
                    params.filterValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when filtering by date", function () {

                    beforeEach(function () {
                        params.filterBy = "date";
                    });

                    beforeEach(function () {
                        $state.go(stateName, params);
                        $rootScope.$digest();
                    });

                    it("should transition successfully", function () {
                        expect($state.current.name).toBe(stateName);
                    });

                    it("should resolve the filterDetails", function () {
                        expect($injector.invoke($state.current.resolve.filterDetails)).toEqual({});
                    });
                });

                describe("when filtering by card", function () {
                    var card;

                    beforeEach(function () {
                        card = TestUtils.getRandomCard(CardModel);
                        params.filterBy = "card";

                        CardManager.fetchCard.and.returnValue($q.resolve(card));
                    });

                    beforeEach(function () {
                        $state.go(stateName, params);
                        $rootScope.$digest();
                    });

                    it("should transition successfully", function () {
                        expect($state.current.name).toBe(stateName);
                    });

                    it("should resolve the filterDetails", function () {
                        $injector.invoke($state.current.resolve.filterDetails)
                            .then(function (filterDetails) {
                                expect(filterDetails).toEqual(card);
                            });
                    });
                });

                describe("when filtering by driver", function () {
                    var driver;

                    beforeEach(function () {
                        driver = TestUtils.getRandomDriver(DriverModel);
                        params.filterBy = "driver";

                        DriverManager.fetchDriver.and.returnValue($q.resolve(driver));
                    });

                    beforeEach(function () {
                        $state.go(stateName, params);
                        $rootScope.$digest();
                    });

                    it("should transition successfully", function () {
                        expect($state.current.name).toBe(stateName);
                    });

                    it("should resolve the filterDetails", function () {
                        $injector.invoke($state.current.resolve.filterDetails)
                            .then(function (filterDetails) {
                                expect(filterDetails).toEqual(driver);
                            });
                    });
                });
            });
        });

        describe("has a transaction.postedDetail state that", function () {
            var state,
                stateName = "transaction.postedDetail";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/posted/detail/:transactionId");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {transactionId: "1234"})).toEqual("#/transaction/posted/detail/1234");
            });

            describe("when navigated to", function () {

                var fetchPostedTransactionDeferred,
                    mockTransactionId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                beforeEach(function () {
                    fetchPostedTransactionDeferred = $q.defer();
                    TransactionManager.fetchPostedTransaction.and.returnValue(fetchPostedTransactionDeferred.promise);

                    $state.go(stateName, {transactionId: mockTransactionId});

                    fetchPostedTransactionDeferred.resolve(mockPostedTransaction);
                    $rootScope.$digest();
                });

                it("should call TransactionManager.fetchPostedTransaction", function () {
                    expect(TransactionManager.fetchPostedTransaction).toHaveBeenCalledWith(mockTransactionId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the postedTransaction", function () {
                    $injector.invoke($state.current.resolve.postedTransaction)
                        .then(function (postedTransaction) {
                            expect(postedTransaction).toEqual(mockPostedTransaction);
                        });
                });

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.POSTED_TRANSACTION_DETAIL.CONFIG.ANALYTICS.pageName);
                });

            });

        });

    });
})();
