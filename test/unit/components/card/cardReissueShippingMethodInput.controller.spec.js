(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $ionicHistory,
        AddressModel,
        ShippingMethodModel,
        mockCardReissue,
        mockGlobals = {
            "CARD_REISSUE_INPUTS": {
                "SHIPPING_METHOD": {
                    "CONFIG": {
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        };

    describe("A Card Reissue Shipping Method Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);

            inject(function ($controller, _$rootScope_, _AddressModel_, _ShippingMethodModel_,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                AddressModel = _AddressModel_;
                ShippingMethodModel = _ShippingMethodModel_;

                $scope = $rootScope.$new();

                mockCardReissue = TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueShippingMethodInputController", {
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
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_INPUTS.SHIPPING_METHOD.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });
        });

        describe("has a confirmSelection function that", function () {
            var shippingMethod;

            beforeEach(function () {
                shippingMethod = TestUtils.getRandomShippingMethod(ShippingMethodModel);

                ctrl.confirmSelection(shippingMethod);
            });

            it("should set cardReissue.selectedShippingMethod to the given shipping method", function () {
                expect(ctrl.cardReissue.selectedShippingMethod).toEqual(shippingMethod);
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();