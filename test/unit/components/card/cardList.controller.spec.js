(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        AnalyticsUtil,
        LoadingIndicator,
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
        mockGlobals = {
            CARD_LIST: {
                "CONFIG"        : {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "events": {
                            "searchSubmitted": [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ]
                        }
                    },
                    "title"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reloadDistance": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "PAGE_SIZE": TestUtils.getRandomInteger(1, 100),
                    "STATUSES": TestUtils.getRandomStringThatIsAlphaNumeric(50)
                }
            }
        },
        mockConfig = mockGlobals.CARD_LIST.CONFIG;

    describe("A Card List Controller", function () {

        beforeEach(function () {

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCards"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["getFocusedView", "resetInfiniteList"]);

            module("app.shared");
            module("app.components", function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (_$rootScope_, _$q_, $controller,_UserModel_, _UserAccountModel_, _CardModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                UserModel = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                CardModel = _CardModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    $scope          : $scope,
                    AnalyticsUtil   : AnalyticsUtil,
                    globals         : mockGlobals,
                    CardManager     : CardManager,
                    ElementUtil     : ElementUtil,
                    LoadingIndicator: LoadingIndicator,
                    UserManager     : UserManager
                });

            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an applySearchFilter function that", function () {
            var searchFilter;

            beforeEach(function () {
                searchFilter = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                ctrl.loadingComplete = true;
                ctrl.cards = [TestUtils.getRandomCard(CardModel)];
            });

            describe("when the filter is equal to the active filter", function () {

                beforeEach(function () {
                    ctrl.searchFilter = ctrl.getActiveSearchFilter();

                    ctrl.applySearchFilter();
                });

                it("should NOT set loadingComplete to false", function () {
                    expect(ctrl.loadingComplete).not.toBeFalsy();
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
                    ctrl.searchFilter = searchFilter;

                    ctrl.applySearchFilter();
                });

                //TODO figure out how to test without getActiveSearchFilter
                it("should set the active filter to the search filter", function () {
                    expect(ctrl.getActiveSearchFilter()).toEqual(searchFilter);
                });

                it("should set loadingComplete to false", function () {
                    expect(ctrl.loadingComplete).toBeFalsy();
                });

                xit("should set currentPage to 0", function () {
                    //TODO figure out how to test this
                });

                it("should set cards to an empty array", function () {
                    expect(ctrl.cards).toEqual([]);
                });

                it("should call ElementUtil.resetInfiniteList", function () {
                    expect(ElementUtil.resetInfiniteList).toHaveBeenCalledWith();
                });

                it("should call AnalyticsUtil.trackEvent", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.searchSubmitted);
                });
            });
        });

        describe("has a getActiveSearchFilter function that", function () {

            xit("should return the active search filter", function () {
                //TODO figure out how to test this
            });
        });

        describe("has a loadNextPage function that", function () {
            var fetchCardsDeferred,
                activeSearchFilter = "";

            beforeEach(function () {
                fetchCardsDeferred = $q.defer();
                CardManager.fetchCards.and.returnValue(fetchCardsDeferred.promise);
            });

            beforeEach(function () {
                ctrl.loadNextPage()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call CardManager.fetchCards with the expected values", function () {
                //TODO figure out how to test activeSearchFilter
                expect(CardManager.fetchCards).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    activeSearchFilter,
                    activeSearchFilter,
                    activeSearchFilter,
                    mockGlobals.CARD_LIST.SEARCH_OPTIONS.STATUSES,
                    0,
                    mockGlobals.CARD_LIST.SEARCH_OPTIONS.PAGE_SIZE
                );
            });

            describe("when fetchCards resolves with an empty list of cards", function () {

                beforeEach(function () {
                    fetchCardsDeferred.resolve([]);

                    $rootScope.$digest();
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });

                it("should set loadingComplete to true", function () {
                    expect(ctrl.loadingComplete).toBeTruthy();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchCards resolves with a non-empty, non-full list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = TestUtils.getRandomInteger(1, mockGlobals.CARD_LIST.SEARCH_OPTIONS.PAGE_SIZE);
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
                    expect(ctrl.cards).toEqual(mockCards);
                });

                xit("should increment the current page", function () {
                    //TODO figure out how to test this
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });

                it("should set loadingComplete to true", function () {
                    expect(ctrl.loadingComplete).toBeTruthy();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchCards resolves with a full list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = mockGlobals.CARD_LIST.SEARCH_OPTIONS.PAGE_SIZE;
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
                    expect(ctrl.cards).toEqual(mockCards);
                });

                xit("should increment the current page", function () {
                    //TODO figure out how to test this
                });

                it("should resolve with a value of false", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(false);
                });

                it("should set loadingComplete to false", function () {
                    expect(ctrl.loadingComplete).toBeFalsy();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchCards rejects", function () {

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

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a pageLoaded function that", function () {

            xit("should set firstPageLoaded to truer", function () {
                //TODO figure out how to test this
            });

        });

        describe("has a resetSearchResults function that", function () {

            beforeEach(function () {
                spyOn($scope, "$broadcast");

                ctrl.resetSearchResults();
            });

            it("should set loadingComplete to false", function () {
                expect(ctrl.loadingComplete).toBeFalsy();
            });

            xit("should set currentPage to 0", function () {
                //TODO figure out how to test this
            });

            it("should set cards to an empty array", function () {
                expect(ctrl.cards).toEqual([]);
            });

            it("should call ElementUtil.resetInfiniteList", function () {
                expect(ElementUtil.resetInfiniteList).toHaveBeenCalledWith();
            });

            it("should broadcast the 'scroll.refreshComplete' event", function () {
                expect($scope.$broadcast).toHaveBeenCalledWith("scroll.refreshComplete");
            });
        });

    });

    function verifyEventTracked(event) {
        expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());
