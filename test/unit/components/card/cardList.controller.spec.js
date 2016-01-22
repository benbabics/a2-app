(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        AnalyticsUtil,
        CommonService,
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

            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCards"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["trackEvent", "trackView"]);

            inject(function (_$rootScope_, _$q_, $controller,
                             _CommonService_, _UserModel_, _UserAccountModel_, _CardModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                UserModel = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                CommonService = _CommonService_;
                CardModel = _CardModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    $scope       : $scope,
                    AnalyticsUtil: AnalyticsUtil,
                    globals      : mockGlobals,
                    CardManager  : CardManager,
                    CommonService: CommonService,
                    UserManager  : UserManager
                });

            });

            //setup spies
            spyOn(CommonService, "loadingBegin");
            spyOn(CommonService, "loadingComplete");

            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an applySearchFilter function that", function () {
            var searchFilter,
                view,
                cardList,
                infiniteListElem,
                infiniteListController;

            beforeEach(function () {
                searchFilter = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                view = jasmine.createSpyObj("view", ["querySelector"]);
                cardList = jasmine.createSpyObj("cardList", ["querySelectorAll"]);
                infiniteListElem = jasmine.createSpyObj("infiniteListElem", ["controller"]);
                infiniteListController = jasmine.createSpyObj("infiniteListController", ["checkBounds"]);

                ctrl.loadingComplete = true;
                ctrl.cards = [TestUtils.getRandomCard(CardModel)];
            });

            beforeEach(function () {
                view.querySelector.and.callFake(function (query) {
                    if (query === ".card-list") {
                        return cardList;
                    }
                    else if (query === "ion-infinite-scroll") {
                        return infiniteListElem;
                    }
                });

                spyOn(CommonService, "getFocusedView").and.returnValue([view]);
                spyOn(angular.element.prototype, "remove");
                spyOn(angular.element.prototype, "controller").and.returnValue(infiniteListController);
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

                it("should NOT remove the existing items from the DOM list", function () {
                    expect(view.querySelector).not.toHaveBeenCalled();
                    expect(cardList.querySelectorAll).not.toHaveBeenCalled();
                    expect(angular.element.prototype.remove).not.toHaveBeenCalled();
                });

                it("should NOT call checkBounds on the infinite scroll's controller", function () {
                    $rootScope.$digest();

                    expect(infiniteListController.checkBounds).not.toHaveBeenCalled();
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

                it("should remove the existing items from the DOM list", function () {
                    expect(view.querySelector).toHaveBeenCalledWith(".card-list");
                    expect(cardList.querySelectorAll).toHaveBeenCalledWith(".row");
                    expect(angular.element.prototype.remove).toHaveBeenCalledWith();
                });

                it("should call checkBounds on the infinite scroll's controller", function () {
                    $rootScope.$digest();

                    expect(infiniteListController.checkBounds).toHaveBeenCalledWith();
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

            it("should call CommonService.loadingBegin", function () {
                expect(CommonService.loadingBegin).toHaveBeenCalledWith();
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchCards resolves with a non-empty list of cards", function () {
                var mockCards;

                beforeEach(function () {
                    var numCards = TestUtils.getRandomInteger(1, 100);
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a pageLoaded function that", function () {

            xit("should set firstPageLoaded to truer", function () {
                //TODO figure out how to test this
            });

        });

    });

    function verifyEventTracked(event) {
        expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());