(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        CommonService,
        CardManager,
        UserManager,
        UserModel,
        AccountModel,
        CardModel,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        mockGlobals = {
            CARD_LIST: {
                "CONFIG"        : {
                    "title"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reloadDistance": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "PAGE_SIZE": TestUtils.getRandomInteger(1, 100),
                    "STATUSES": TestUtils.getRandomStringThatIsAlphaNumeric(50)
                }
            }
        };

    describe("A Transaction List Controller", function () {

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

            inject(function (_$rootScope_, _$q_, $controller,
                             _CommonService_, _UserModel_, _AccountModel_, _CardModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                UserModel = _UserModel_;
                AccountModel = _AccountModel_;
                CommonService = _CommonService_;
                CardModel = _CardModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    $scope       : $scope,
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
            mockUser = TestUtils.getRandomUser(UserModel, AccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            // Doesn't do anything yet

        });

        describe("has a loadNextPage function that", function () {
            var fetchCardsDeferred;

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
                expect(CardManager.fetchCards).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    undefined,
                    undefined,
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                });
            });
        });

    });

}());