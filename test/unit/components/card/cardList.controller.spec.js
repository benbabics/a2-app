(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        ElementUtil,
        CardManager,
        UserManager,
        UserModel,
        UserAccountModel,
        CardModel,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        globals,
        config,
        self;

    describe("A Card List Controller", function () {

        beforeEach(function () {
            self = this;

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCards"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["getFocusedView", "resetInfiniteList"]);

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (_$rootScope_, _$q_, $controller, _globals_, _UserModel_, _UserAccountModel_, _CardModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                UserModel = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                CardModel = _CardModel_;
                globals = _globals_;
                config = globals.CARD_LIST.CONFIG;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    $scope:      $scope,
                    CardManager: CardManager,
                    ElementUtil: ElementUtil,
                    UserManager: UserManager
                });
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        afterEach(function () {
            $rootScope =
                $scope =
                $q =
                ElementUtil =
                CardManager =
                UserManager =
                UserModel =
                UserAccountModel =
                CardModel =
                ctrl =
                resolveHandler =
                rejectHandler =
                mockUser =
                globals =
                config =
                self = null;
        });

        describe("has an activate function that", function () {
            it("should have infiniteListController methods on $scope", function () {
                expect( $scope.loadNextPage ).toBeDefined();
                expect( $scope.resetSearchResults ).toBeDefined();
            });

            it("should have infiniteScrollService defined on $scope", function () {
                expect( $scope.infiniteScrollService ).toBeDefined();
            });

            it("should have vm.payments equal model", function () {
                expect( ctrl.cards ).toEqual( $scope.infiniteScrollService.model );
            });
        });

        describe("has an applySearchFilter function that", function () {
            var searchFilter;

            beforeEach(function () {
                searchFilter = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                ctrl.cards = [TestUtils.getRandomCard(CardModel)];
            });

            describe("when the filter is equal to the active filter", function () {
                beforeEach(function () {
                    ctrl.searchFilter = ctrl.getActiveSearchFilter();
                    ctrl.applySearchFilter();
                    $scope.infiniteScrollService.isLoadingComplete = true;
                });

                it("should NOT set loadingComplete to false", function () {
                    expect( $scope.infiniteScrollService.isLoadingComplete ).not.toBeFalsy();
                });

                xit("should NOT set currentPage to 0", function () {
                    //TODO figure out how to test this
                });

                it("should NOT set cards to an empty array", function () {
                    expect(ctrl.cards).not.toEqual([]);
                });

                it("should NOT call ElementUtil.resetInfiniteList", function () {
                    expect(ElementUtil.resetInfiniteList).not.toHaveBeenCalled();
                });
            });

            describe("when the filter is NOT equal to the active filter", function () {
                beforeEach(function () {
                    CardManager.fetchCards.and.returnValue($q.resolve());
                    ctrl.searchFilter = searchFilter;
                    ctrl.applySearchFilter();
                });

                //TODO figure out how to test without getActiveSearchFilter
                it("should set the active filter to the search filter", function () {
                    expect(ctrl.getActiveSearchFilter()).toEqual(searchFilter);
                });

                it("should set loadingComplete to false", function () {
                    expect( $scope.infiniteScrollService.isLoadingComplete ).toBeFalsy();
                });

                xit("should set currentPage to 0", function () {
                    //TODO figure out how to test this
                });

                it("should call this.AnalyticsUtil.trackEvent", function () {
                    verifyEventTracked(config.ANALYTICS.events.searchSubmitted);
                });
            });
        });

        describe("has a getActiveSearchFilter function that", function () {
            xit("should return the active search filter", function () {
                //TODO figure out how to test this
            });
        });

        describe("has a handleMakeRequest function that", function () {
            var fetchCardsDeferred,
                activeSearchFilter = "",
                orderby = "status";

            beforeEach(function () {
                fetchCardsDeferred = $q.defer();
                CardManager.fetchCards.and.returnValue(fetchCardsDeferred.promise);
            });

            beforeEach(function () {
                $scope.loadNextPage()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call CardManager.fetchCards with the expected values", function () {
                //TODO figure out how to test activeSearchFilter
                expect(CardManager.fetchCards).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    activeSearchFilter,
                    activeSearchFilter,
                    activeSearchFilter,
                    globals.CARD_LIST.SEARCH_OPTIONS.STATUSES,
                    $scope.infiniteScrollService.settings.currentPage,
                    $scope.infiniteScrollService.settings.pageSize,
                    orderby
                );
            });

            describe("when fetchCards resolves with an empty list of cards", function () {
                beforeEach(function () {
                    fetchCardsDeferred.resolve([]);
                    $rootScope.$digest();
                });

                it("resolveHandler should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });

                it("should have isLoadingComplete be true", function () {
                    expect( $scope.infiniteScrollService.isLoadingComplete ).toBeTruthy();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });
            });

            describe("when makeRequest resolves with a non-empty, non-full list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = TestUtils.getRandomInteger(1, globals.CARD_LIST.SEARCH_OPTIONS.PAGE_SIZE);
                    mockCards = [];
                    for (var i = 0; i < numCards; ++i) {
                        mockCards.push(TestUtils.getRandomCard(CardModel));
                    }
                });

                beforeEach(function () {
                    fetchCardsDeferred.resolve(mockCards);
                    $rootScope.$digest();
                });

                it("should add the cards to the list", function () {
                    expect( ctrl.cards.collection.length ).toEqual( mockCards.length );
                });

                xit("should increment the current page", function () {
                    //TODO figure out how to test this
                });

                it("should set loadingComplete to true", function () {
                    expect( $scope.infiniteScrollService.isLoadingComplete ).toBeTruthy();
                });
            });

            describe("when makeRequest resolves with a full list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = globals.CARD_LIST.SEARCH_OPTIONS.PAGE_SIZE;
                    mockCards = [];
                    for (var i = 0; i < numCards; ++i) {
                        mockCards.push(TestUtils.getRandomCard(CardModel));
                    }
                });

                beforeEach(function () {
                    fetchCardsDeferred.resolve(mockCards);
                    $rootScope.$digest();
                });

                it("should add the cards to the list", function () {
                    expect( ctrl.cards.collection.length ).toEqual( mockCards.length );
                });

                xit("should increment the current page", function () {
                    //TODO figure out how to test this
                });
            });

            describe("when makeRequest resolves with a full list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = 4;
                    mockCards = [];
                    for (var i = 0; i < numCards; ++i) {
                        mockCards.push( TestUtils.getRandomCard(CardModel) );
                    }

                    _.extend(mockCards[0], { status: "ACTIVE",   embossedCardNumber: "0003" });
                    _.extend(mockCards[1], { status: "INACTIVE", embossedCardNumber: "0004" });
                    _.extend(mockCards[2], { status: "ACTIVE",   embossedCardNumber: "0001" });
                    _.extend(mockCards[3], { status: "INACTIVE", embossedCardNumber: "0002" });
                });

                beforeEach(function () {
                    // mockCards will be sorted messing up original indexes
                    var collection = _.cloneDeep( mockCards );
                    // resolve with cloned collection
                    fetchCardsDeferred.resolve( collection );
                    $rootScope.$digest();
                });
            });

            describe("when makeRequest rejects", function () {
                beforeEach(function () {
                    fetchCardsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });
            });
        });

        describe("has a resetSearchResults function that", function () {
            beforeEach(function () {
                CardManager.fetchCards.and.returnValue($q.resolve([]));
                $scope.resetSearchResults();
                $scope.$apply();
            });

            xit("should set currentPage to 0", function () {
                //TODO figure out how to test this
            });

            it("should set cards to an empty array", function () {
                expect( ctrl.cards.collection ).toEqual([]);
            });
        });

    });

    function verifyEventTracked(event) {
        expect(self.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());
