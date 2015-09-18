(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        mockCard,
        mockGlobals = {
            "CARD_CHANGE_STATUS": {
                "CONFIG": {
                    "statuses": {
                        "activate" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "terminate": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "card"    : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        };

    describe("A Card Change Status Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");

            inject(function ($controller, _$rootScope_, CardModel) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                mockCard = TestUtils.getRandomCard(CardModel);

                ctrl = $controller("CardChangeStatusController", {
                    $scope : $scope,
                    globals: mockGlobals,
                    card   : mockCard
                });
            });
        });

        it("should set card to the given card object", function () {
            expect(ctrl.card).toEqual(mockCard);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_CHANGE_STATUS.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });
        });
    });
})();