(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        CardReissueManager;

    describe("A Card Reissue Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");

            //mock dependencies:
            CardReissueManager = jasmine.createSpyObj("CardReissueManager", ["clearCardReissueDetails"]);

            inject(function ($controller, _$rootScope_) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                ctrl = $controller("CardReissueController", {
                    $scope            : $scope,
                    CardReissueManager: CardReissueManager
                });
            });

        });

        describe("has a destroy function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$destroy");
            });

            it("should call CardReissueManager.clearCardReissueDetails", function () {
                expect(CardReissueManager.clearCardReissueDetails).toHaveBeenCalledWith();
            });
        });
    });
})();