(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $ionicHistory,
        sharedGlobals,
        mockCardReissueDetails,
        mockGlobals = {
            "CARD_REISSUE_INPUTS": {
                "REISSUE_REASON": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG;

    describe("A Card Reissue Reason Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($controller, _$rootScope_, _sharedGlobals_, $q, AddressModel, ShippingMethodModel,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                sharedGlobals = _sharedGlobals_;

                $scope = $rootScope.$new();

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueReasonInputController", {
                    $scope            : $scope,
                    $ionicHistory     : $ionicHistory,
                    globals           : mockGlobals,
                    cardReissueDetails: mockCardReissueDetails
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.cardReissueDetails).toEqual(mockCardReissueDetails);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG);
        });

        describe("has a confirmSelection function that", function () {
            var reissueReason;

            beforeEach(function () {
                reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);

                ctrl.confirmSelection(reissueReason);
            });

            it("should set cardReissueDetails.reissueReason to the given reissue reason", function () {
                expect(ctrl.cardReissueDetails.reissueReason).toEqual(reissueReason);
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();