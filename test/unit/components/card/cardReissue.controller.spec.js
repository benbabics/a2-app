(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        mockAccount,
        mockCard,
        mockCardReissueDetails;

    describe("A Card Reissue Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            inject(function (_$rootScope_, AccountModel, AddressModel, CardModel, CardReissueModel, ShippingCarrierModel, ShippingMethodModel) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                mockAccount = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
                mockCard = TestUtils.getRandomCard(CardModel);
                mockCardReissueDetails = new CardReissueModel();
            });
        });

        describe("when the default card shipping address is a PO Box", function () {

            beforeEach(function () {
                mockAccount.defaultCardShippingAddress.addressLine1 = "PO Box " + TestUtils.getRandomInteger(1, 1000);
            });

            beforeEach(function () {
                inject(function ($controller) {

                    ctrl = $controller("CardReissueController", {
                        $scope            : $scope,
                        account           : mockAccount,
                        card              : mockCard,
                        cardReissueDetails: mockCardReissueDetails
                    });
                });
            });

            it("should set the expected account on cardReissueDetails", function () {
                expect(mockCardReissueDetails.account).toEqual(mockAccount);
            });

            it("should set the expected card on cardReissueDetails", function () {
                expect(mockCardReissueDetails.originalCard).toEqual(mockCard);
            });

            it("should set reissuedCard to be falsy", function () {
                expect(mockCardReissueDetails.reissuedCard).toBeFalsy();
            });

            it("should set the expected shippingAddress on cardReissueDetails", function () {
                expect(mockCardReissueDetails.shippingAddress).toEqual(mockAccount.defaultCardShippingAddress);
            });

            it("should set the expected reissueReason on cardReissueDetails", function () {
                expect(mockCardReissueDetails.reissueReason).toEqual("");
            });

            it("should set the expected selectedShippingMethod on cardReissueDetails", function () {
                expect(mockCardReissueDetails.selectedShippingMethod).toEqual(mockAccount.regularCardShippingMethod);
            });

            it("should set the expected shippingMethods on cardReissueDetails", function () {
                expect(mockCardReissueDetails.shippingMethods).toEqual([mockAccount.regularCardShippingMethod]);
            });
        });

        describe("when the default card shipping address is NOT a PO Box", function () {

            beforeEach(function () {
                mockAccount.defaultCardShippingAddress.addressLine1 = TestUtils.getRandomStringThatIsAlphaNumeric(20);
            });

            beforeEach(function () {
                inject(function ($controller) {

                    ctrl = $controller("CardReissueController", {
                        $scope            : $scope,
                        account           : mockAccount,
                        card              : mockCard,
                        cardReissueDetails: mockCardReissueDetails
                    });
                });
            });

            it("should set the expected account on cardReissueDetails", function () {
                expect(mockCardReissueDetails.account).toEqual(mockAccount);
            });

            it("should set the expected card on cardReissueDetails", function () {
                expect(mockCardReissueDetails.originalCard).toEqual(mockCard);
            });

            it("should set reissuedCard to be falsy", function () {
                expect(mockCardReissueDetails.reissuedCard).toBeFalsy();
            });

            it("should set the expected shippingAddress on cardReissueDetails", function () {
                expect(mockCardReissueDetails.shippingAddress).toEqual(mockAccount.defaultCardShippingAddress);
            });

            it("should set the expected reissueReason on cardReissueDetails", function () {
                expect(mockCardReissueDetails.reissueReason).toEqual("");
            });

            it("should set the expected selectedShippingMethod on cardReissueDetails", function () {
                expect(mockCardReissueDetails.selectedShippingMethod).toEqual(mockAccount.cardShippingCarrier.getDefaultShippingMethod());
            });

            it("should move the regular shipping method to the front of the shipping methods array", function () {
                var expectedArray = mockAccount.cardShippingCarrier.shippingMethods.slice();
                _.remove(expectedArray, {id: mockAccount.regularCardShippingMethod.id});
                expectedArray.unshift(mockAccount.regularCardShippingMethod);

                expect(mockCardReissueDetails.shippingMethods).toEqual(expectedArray);
            });
        });
    });
})();