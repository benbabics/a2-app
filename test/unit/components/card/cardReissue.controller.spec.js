(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        AddressModel,
        ShippingMethodModel,
        sharedGlobals,
        mockCardReissue,
        mockGlobals = {
            "CARD_REISSUE": {
                "CONFIG": {
                    "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "shippingAddress"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "shippingMethod"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reissueReason"      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "selectReissueReason": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "submitButton"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "instructionalText"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "poBoxText"          : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        };

    describe("A Card Reissue Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            inject(function ($controller, _$rootScope_, _sharedGlobals_, _AddressModel_, _ShippingMethodModel_,
                             CardReissueModel, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                sharedGlobals = _sharedGlobals_;
                AddressModel = _AddressModel_;
                ShippingMethodModel = _ShippingMethodModel_;

                $scope = $rootScope.$new();

                mockCardReissue = TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel)

                ctrl = $controller("CardReissueController", {
                    $scope     : $scope,
                    globals    : mockGlobals,
                    cardReissue: mockCardReissue
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.cardReissue).toEqual(mockCardReissue);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });
        });

        describe("has an isFormComplete function that", function () {

            describe("when the shipping address is null", function () {

                beforeEach(function () {
                    mockCardReissue.shippingAddress = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissue.shippingAddress;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address is empty", function () {

                beforeEach(function () {
                    mockCardReissue.shippingAddress = {};
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is null", function () {

                beforeEach(function () {
                    mockCardReissue.selectedShippingMethod = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissue.selectedShippingMethod;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is empty", function () {

                beforeEach(function () {
                    mockCardReissue.selectedShippingMethod = {};
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is null", function () {

                beforeEach(function () {
                    mockCardReissue.reissueReason = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissue.reissueReason;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is empty", function () {

                beforeEach(function () {
                    mockCardReissue.reissueReason = "";
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address, selected shipping method, and reissue reason are valid", function () {

                beforeEach(function () {
                    mockCardReissue.shippingAddress = TestUtils.getRandomAddress(AddressModel);
                    mockCardReissue.selectedShippingMethod = TestUtils.getRandomShippingMethod(ShippingMethodModel);
                    mockCardReissue.reissueReason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return true", function () {
                    expect(ctrl.isFormComplete()).toBeTruthy();
                });
            });
        });
    });
})();