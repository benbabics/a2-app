(function () {
    "use strict";

    var $q,
        $rootScope,
        accountId = TestUtils.getRandomStringThatIsAlphaNumeric(10),
        embossedCardNumberFilter = TestUtils.getRandomStringThatIsAlphaNumeric(3),
        embossingValue2Filter = TestUtils.getRandomStringThatIsAlphaNumeric(5),
        pageNumber = TestUtils.getRandomNumberWithLength(1),
        pageSize = TestUtils.getRandomNumberWithLength(2),
        paymentId = TestUtils.getRandomStringThatIsAlphaNumeric(5),
        resolveHandler,
        rejectHandler,
        statuses = TestUtils.getRandomStringThatIsAlphaNumeric(10),
        CardManager,
        CardModel,
        CardsResource,
        mockCardCollection;

    describe("A Card Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.card");

            // mock dependencies
            CardsResource = jasmine.createSpyObj("CardsResource", [
                "getCards"
            ]);

            module(function ($provide) {
                $provide.value("CardsResource", CardsResource);
            });

            inject(function (_$q_, _$rootScope_, _CardManager_, _CardModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                CardManager = _CardManager_;
                CardModel = _CardModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            var numModels, i;

            mockCardCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockCardCollection.push(TestUtils.getRandomCard(CardModel));
            }
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function () {
                CardManager.setCards(mockCardCollection);
                $rootScope.$broadcast("userLoggedOut");
            });

            it("should reset the cards", function () {
                expect(CardManager.getCards()).toEqual([]);
            });

        });

        describe("has a fetchCard function that", function () {
            var fetchedCard,
                cardToFetch;

            describe("when cards is NOT empty", function () {

                beforeEach(function () {
                    cardToFetch = TestUtils.getRandomValueFromArray(mockCardCollection);
                    CardManager.setCards(mockCardCollection);
                });

                describe("when the card to fetch is in the list", function () {

                    beforeEach(function () {
                        CardManager.fetchCard(cardToFetch.cardId)
                            .then(function (cardFound) {
                                fetchedCard = cardFound;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return the expected card", function () {
                        expect(fetchedCard).toEqual(cardToFetch);
                    });


                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when the card to fetch is NOT in the list", function () {

                    beforeEach(function () {
                        CardManager.fetchCard(paymentId)
                            .then(function (cardFound) {
                                fetchedCard = cardFound;
                            })
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should return undefined", function () {
                        expect(fetchedCard).toBeUndefined();
                    });


                    it("should NOT reject", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

            });

            describe("when cards is empty", function () {

                beforeEach(function () {
                    CardManager.setCards([]);

                    CardManager.fetchCard(paymentId)
                        .then(function (cardFound) {
                            fetchedCard = cardFound;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should return undefined", function () {
                    expect(fetchedCard).toBeUndefined();
                });


                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a fetchCards function that", function () {

            var getCardsDeferred;

            beforeEach(function () {
                getCardsDeferred = $q.defer();

                CardsResource.getCards.and.returnValue(getCardsDeferred.promise);

                CardManager.fetchCards(accountId, embossedCardNumberFilter, embossingValue2Filter, statuses, pageNumber, pageSize)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting the cards", function () {

                it("should call CardsResource.getCards", function () {
                    expect(CardsResource.getCards).toHaveBeenCalledWith(accountId, {
                        embossedCardNumberFilter: embossedCardNumberFilter,
                        embossingValue2Filter   : embossingValue2Filter,
                        status                  : statuses,
                        pageNumber: pageNumber,
                        pageSize  : pageSize
                    });
                });

            });

            describe("when the cards are fetched successfully", function () {

                var mockRemoteCards = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteCards.data = mockCardCollection.slice();
                        getCardsDeferred.resolve(mockRemoteCards);

                        CardsResource.getCards.and.returnValue(getCardsDeferred.promise);

                        CardManager.fetchCards(accountId, embossedCardNumberFilter, embossingValue2Filter, statuses, pageNumber, pageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should set the cards", function () {
                        expect(CardManager.getCards()).toEqual(mockCardCollection);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockRemoteCards.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getCardsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when retrieving the cards fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getCardsDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

            });

        });

        describe("has a getCards function that", function () {

            it("should return the cards passed to setCards", function () {
                var result;

                CardManager.setCards(mockCardCollection);
                result = CardManager.getCards();

                expect(result).toEqual(mockCardCollection);
            });

            // TODO: figure out how to test this without using setCards
        });

        describe("has a setCards function that", function () {

            it("should update the cards returned by getCards", function () {
                var result;

                CardManager.setCards(mockCardCollection);
                result = CardManager.getCards();

                expect(result).toEqual(mockCardCollection);
            });

            // TODO: figure out how to test this without using getCards
        });

    });

})();