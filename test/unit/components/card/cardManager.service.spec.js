(function () {
    "use strict";

    var $q,
        $rootScope,
        paymentId = TestUtils.getRandomStringThatIsAlphaNumeric(5),
        resolveHandler,
        rejectHandler,
        CardManager,
        CardModel,
        CardsResource,
        mockCachedCardCollection,
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

            mockCachedCardCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockCachedCardCollection.push(TestUtils.getRandomCard(CardModel));
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

            var getCardsDeferred,
                mockAccountId,
                mockEmbossedCardNumberFilter,
                mockEmbossingValue2Filter,
                mockStatuses,
                mockPageNumber,
                mockPageSize;

            beforeEach(function () {
                getCardsDeferred = $q.defer();
                mockAccountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                mockEmbossedCardNumberFilter = TestUtils.getRandomStringThatIsAlphaNumeric(5);
                mockEmbossingValue2Filter = TestUtils.getRandomStringThatIsAlphaNumeric(5);
                mockStatuses = TestUtils.getRandomStringThatIsAlphaNumeric(50);
                mockPageNumber = TestUtils.getRandomInteger(0, 10);
                mockPageSize = TestUtils.getRandomInteger(1, 100);

                CardManager.setCards(mockCachedCardCollection.slice());

                CardsResource.getCards.and.returnValue(getCardsDeferred.promise);
            });

            describe("when getting the cards", function () {

                beforeEach(function () {
                    CardManager.fetchCards(mockAccountId, mockEmbossedCardNumberFilter, mockEmbossingValue2Filter, mockStatuses, mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call CardsResource.getCards", function () {
                    expect(CardsResource.getCards).toHaveBeenCalledWith(mockAccountId, {
                        embossedCardNumberFilter: mockEmbossedCardNumberFilter,
                        embossingValue2Filter   : mockEmbossingValue2Filter,
                        status                  : mockStatuses,
                        pageNumber              : mockPageNumber,
                        pageSize                : mockPageSize
                    });
                });
            });

            describe("when the cards are fetched successfully", function () {
                var mockCards = {data: {}};

                beforeEach(function () {
                    mockCards.data = mockCardCollection.slice();
                });

                describe("when there is data in the response", function () {

                    describe("when the first page is requested", function () {

                        beforeEach(function () {
                            mockPageNumber = 0;

                            CardManager.fetchCards(mockAccountId, mockEmbossedCardNumberFilter, mockEmbossingValue2Filter, mockStatuses, mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            getCardsDeferred.resolve(mockCards);

                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(mockCards.data);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        it("should reset cards to an array of models set from the data", function () {
                            expect(CardManager.getCards()).toEqual(mockCardCollection);
                        });
                    });

                    describe("when a page beyond the first page requested", function () {

                        beforeEach(function () {
                            mockPageNumber = TestUtils.getRandomInteger(1, 10);

                            CardManager.fetchCards(mockAccountId, mockEmbossedCardNumberFilter, mockEmbossingValue2Filter, mockStatuses, mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        describe("when there are cards in the fetched data that are already cached", function () {

                            beforeEach(function () {
                                Array.prototype.push.apply(mockCards.data, mockCachedCardCollection);

                                getCardsDeferred.resolve(mockCards);

                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockCards.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add only the uncached cards from the data to cards", function () {
                                var expectedValues = _.unique(mockCachedCardCollection.concat(mockCards.data), "cardId");

                                expect(CardManager.getCards()).toEqual(expectedValues);
                            });
                        });

                        describe("when there are no cards in the fetched data that are already cached", function () {

                            beforeEach(function () {
                                getCardsDeferred.resolve(mockCards);

                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockCards.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add all of the fetched cards to cards", function () {
                                expect(CardManager.getCards()).toEqual(mockCachedCardCollection.concat(mockCards.data));
                            });
                        });
                    });
                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        CardManager.fetchCards(mockAccountId, mockEmbossedCardNumberFilter, mockEmbossingValue2Filter, mockStatuses, mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    beforeEach(function () {
                        getCardsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT modify cards", function () {
                        expect(CardManager.getCards()).toEqual(mockCachedCardCollection);
                    });
                });
            });

            describe("when retrieving the cards fails", function () {
                var mockResponse = "Some error";

                beforeEach(function () {
                    CardManager.fetchCards(mockAccountId, mockEmbossedCardNumberFilter, mockEmbossingValue2Filter, mockStatuses, mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

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