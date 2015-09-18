(function () {
    "use strict";

    describe("A Card Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockCard,
            CardManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.html");

            // mock dependencies
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCard"]);
            module(function ($provide) {
                $provide.value("CardManager", CardManager);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, CardModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                mockCard = TestUtils.getRandomCard(CardModel);
            });
        });

        describe("has a card state that", function () {
            var state,
                stateName = "card";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/card");
            });

            it("should define a view on the root container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });

        describe("has a card.list state that", function () {
            var state,
                stateName = "card.list";

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
                expect($state.href(stateName)).toEqual("#/card/list");
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

        describe("has a card.detail state that", function () {
            var state,
                stateName = "card.detail";

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
                expect(state.url).toEqual("/detail/:cardId");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {cardId: "1234"})).toEqual("#/card/detail/1234");
            });

            describe("when navigated to", function () {

                var fetchCardDeferred,
                    mockCardId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                beforeEach(function () {
                    fetchCardDeferred = $q.defer();
                    CardManager.fetchCard.and.returnValue(fetchCardDeferred.promise);

                    $state.go(stateName, {cardId: mockCardId});

                    fetchCardDeferred.resolve(mockCard);
                    $rootScope.$digest();
                });

                it("should call CardManager.fetchCard", function () {
                    expect(CardManager.fetchCard).toHaveBeenCalledWith(mockCardId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the card", function () {
                    $injector.invoke($state.current.views["view@card"].resolve.card)
                        .then(function (card) {
                            expect(card).toEqual(mockCard);
                        });
                });

            });

        });

        describe("has a card.changeStatus state that", function () {
            var state,
                stateName = "card.changeStatus";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/changeStatus/:cardId");
            });

            describe("when a child state is navigated to", function () {
                var childStateName = "card.changeStatus.form",
                    fetchCardDeferred;

                beforeEach(function () {
                    fetchCardDeferred = $q.defer();
                    CardManager.fetchCard.and.returnValue(fetchCardDeferred.promise);
                });

                beforeEach(function () {
                    $state.go(childStateName, {cardId: mockCard.cardId});

                    fetchCardDeferred.resolve(mockCard);
                    $rootScope.$digest();
                });

                it("should resolve the expected card", function () {
                    $injector.invoke($state.$current.parent.resolve.card)
                        .then(function (card) {
                            expect(card).toEqual(mockCard);
                        });
                });
            });
        });

        describe("has a card.changeStatus.form state that", function () {
            var state,
                stateName = "card.changeStatus.form";

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

            it("should use its parent's URL", function () {
                expect(state.url).toEqual("");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {cardId: mockCard.cardId})).toEqual("#/card/changeStatus/" + mockCard.cardId);
            });
        });
    });
})();