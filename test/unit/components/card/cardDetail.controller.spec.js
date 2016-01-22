(function () {
    "use strict";

    var $scope,
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

            inject(function ($controller, $rootScope, $q, CommonService, CardModel) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockCard = TestUtils.getRandomCard(CardModel);

                ctrl = $controller("CardDetailController", {
                    $scope : $scope,
                    card   : mockCard,
                    globals: mockGlobals
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the card", function () {
                expect(ctrl.card).toEqual(mockCard);
            });

        });

    });

}());