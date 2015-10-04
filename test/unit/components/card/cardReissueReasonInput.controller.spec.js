(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $ionicHistory,
        sharedGlobals,
        mockCardReissue,
        mockGlobals = {
            "CARD_REISSUE_INPUTS": {
                "REISSUE_REASON": {
                    "CONFIG": {
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        };

    describe("A Card Reissue Reason Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($controller, _$rootScope_, _sharedGlobals_, AddressModel, ShippingMethodModel,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                sharedGlobals = _sharedGlobals_;

                $scope = $rootScope.$new();

                mockCardReissue = TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueReasonInputController", {
                    $scope       : $scope,
                    $ionicHistory: $ionicHistory,
                    globals      : mockGlobals,
                    cardReissue  : mockCardReissue
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.cardReissue).toEqual(mockCardReissue);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });
        });

        describe("has a confirmSelection function that", function () {
            var reissueReason;

            beforeEach(function () {
                reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);

                ctrl.confirmSelection(reissueReason);
            });

            it("should set cardReissue.reissueReason to the given reissue reason", function () {
                expect(ctrl.cardReissue.reissueReason).toEqual(reissueReason);
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();