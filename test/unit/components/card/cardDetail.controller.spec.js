(function () {
    "use strict";

    var $ionicHistory,
        $q,
        $rootScope,
        $scope,
        $state,
        Navigation,
        ctrl,
        mockCard,
        mockGlobals = {
            "CARD_DETAIL": {
                "CONFIG": {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cardNumber"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "standardEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "optionalEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "status"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "changeStatusButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reissueCardButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockConfig = mockGlobals.CARD_DETAIL.CONFIG;

    describe("A Card Detail Controller", function () {

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

            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _)]);

            //mock dependencies
            Navigation = jasmine.createSpyObj("Navigation", ["goToTransactionActivity"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["clearCache"]);

            inject(function ($controller, _$rootScope_, _$q_, _$state_, CardModel) {

                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
                $q = _$q_;

                mockCard = TestUtils.getRandomCard(CardModel);
                $state = _$state_;

                ctrl = $controller("CardDetailController", {
                    $ionicHistory: $ionicHistory,
                    $scope       : $scope,
                    card         : mockCard,
                    globals      : mockGlobals,
                    Navigation   : Navigation
                });

            });

            //setup mocks
            $ionicHistory.clearCache.and.returnValue($q.resolve());
        });

        it("should set the card", function () {
            expect(ctrl.card).toEqual(mockCard);
        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                spyOn($state, "go").and.stub();

                ctrl.goToTransactionActivity();
                $rootScope.$digest();
            });

            it("should call $ionicHistory.clearCache with the expected values", function () {
                expect($ionicHistory.clearCache).toHaveBeenCalledWith(["transaction"]);
            });

            it("should call $state.go with the expected values", function () {
                expect($state.go).toHaveBeenCalledWith("transaction.filterBy", {
                    filterBy: "card",
                    filterValue: mockCard.cardId
                });
            });
        });

    });

}());
