(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $ionicHistory,
        AddressModel,
        ShippingMethodModel,
        mockCardReissueDetails,
        mockGlobals = {
            "CARD_REISSUE_INPUTS": {
                "SHIPPING_METHOD": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG;

    describe("A Card Reissue Shipping Method Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($controller, _$rootScope_, _AddressModel_, _ShippingMethodModel_, $q,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                AddressModel = _AddressModel_;
                ShippingMethodModel = _ShippingMethodModel_;

                $scope = $rootScope.$new();

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueShippingMethodInputController", {
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
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG);
        });

        describe("has a confirmSelection function that", function () {
            var shippingMethod;

            beforeEach(function () {
                shippingMethod = TestUtils.getRandomShippingMethod(ShippingMethodModel);

                ctrl.confirmSelection(shippingMethod);
            });

            it("should set cardReissueDetails.selectedShippingMethod to the given shipping method", function () {
                expect(ctrl.cardReissueDetails.selectedShippingMethod).toEqual(shippingMethod);
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();