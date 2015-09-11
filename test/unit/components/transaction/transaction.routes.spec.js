(function () {
    "use strict";

    describe("A Transaction Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockPostedTransaction,
            TransactionManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.transaction");
            module("app.html");

            // mock dependencies
            TransactionManager = jasmine.createSpyObj("TransactionManager", ["fetchPostedTransaction"]);
            module(function ($provide) {
                $provide.value("TransactionManager", TransactionManager);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, PostedTransactionModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/list");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/transaction/list");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

            });

        });

        describe("has a transaction.posted state that", function () {
            var state,
                stateName = "transaction.posted";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/posted");
            });

            it("should define a transaction view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@transaction"]).toBeDefined();
                expect(state.views["view@transaction"].template).toEqual("<ion-nav-view></ion-nav-view>");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/transaction/posted");
            });
        });

        describe("has a transaction.posted.detail state that", function () {
            var state,
                stateName = "transaction.posted.detail";

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
                expect(state.url).toEqual("/detail/:transactionId");
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

            });

        });

    });
})();