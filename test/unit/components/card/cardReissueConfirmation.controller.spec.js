(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        Navigation,
        mockCardReissueDetails,
        mockGlobals = {
            "CARD_REISSUE_CONFIRMATION": {
                "CONFIG": {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cardNumber"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "standardEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "optionalEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "status"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cards"              : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockConfig = mockGlobals.CARD_REISSUE_CONFIRMATION.CONFIG;

    describe("A Card Reissue Confirmation Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards"]);

            inject(function ($controller, _$rootScope_, $q, AddressModel, ShippingMethodModel,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueConfirmationController", {
                    $scope            : $scope,
                    globals           : mockGlobals,
                    cardReissueDetails: mockCardReissueDetails,
                    Navigation        : Navigation
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.reissuedCard).toEqual(mockCardReissueDetails.reissuedCard);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_CONFIRMATION.CONFIG);
        });

        describe("has a goToCards function that", function () {

            beforeEach(function () {
                ctrl.goToCards();
            });

            it("should call Navigation.goToCards", function () {
                expect(Navigation.goToCards).toHaveBeenCalledWith();
            });
        });
    });
})();
