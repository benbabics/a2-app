(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        CardReissueManager,
        mockCardReissueDetails,
        mockGlobals = {
            "CARD_REISSUE_CONFIRMATION": {
                "CONFIG": {
                    "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cardNumber"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "standardEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "optionalEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "status"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cards"              : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        };

    describe("A Card Reissue Confirmation Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            CardReissueManager = jasmine.createSpyObj("CardReissueManager", ["clearCardReissueDetails"]);

            inject(function ($controller, _$rootScope_, AddressModel, ShippingMethodModel,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueConfirmationController", {
                    $scope            : $scope,
                    globals           : mockGlobals,
                    cardReissueDetails: mockCardReissueDetails,
                    CardReissueManager: CardReissueManager
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.reissuedCard).toEqual(mockCardReissueDetails.reissuedCard);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_CONFIRMATION.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should call CardReissueManager.clearCardReissueDetails", function () {
                expect(CardReissueManager.clearCardReissueDetails).toHaveBeenCalledWith();
            });
        });
    });
})();