(function () {
    "use strict";

    var $scope,
        ctrl,
        mockCard;

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

            inject(function ($controller, $rootScope, CardModel) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                mockCard = TestUtils.getRandomCard(CardModel);

                ctrl = $controller("CardDetailController", {
                    $scope: $scope,
                    card  : mockCard
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