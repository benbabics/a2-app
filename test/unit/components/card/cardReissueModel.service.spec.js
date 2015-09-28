(function () {
    "use strict";

    describe("A Card Reissue Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.components.card");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var cardReissue,
                mockCardReissueResource,
                cardReissueModelKeys,
                cardReissueResourceKeys;

            beforeEach(inject(function (CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel) {
                cardReissue = new CardReissueModel();

                mockCardReissueResource = angular.extend(TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in cardReissue) {
                    if (_.has(cardReissue, property)) {
                        cardReissue[property] = "default";
                    }
                }

                cardReissueModelKeys = _.keys(cardReissue);
                cardReissueResourceKeys = _.keys(mockCardReissueResource);
            }));

            it("should set the CardReissueModel object with the fields from the passed in cardReissueResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(cardReissueModelKeys, cardReissueResourceKeys);

                cardReissue.set(mockCardReissueResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(cardReissue[key]).toEqual(mockCardReissueResource[key]);
                }
            });

            it("should NOT change the CardReissueModel object fields that the cardReissueResource object does not have", function () {
                var key,
                    keysDifference = _.difference(cardReissueModelKeys, cardReissueResourceKeys);

                cardReissue.set(mockCardReissueResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(cardReissue[key]).toEqual("default");
                }
            });

            it("should extend the CardReissueModel object with the fields from the passed in cardReissueResource object that the CardReissueModel does not have", function () {
                var key,
                    keysDifference = _.difference(cardReissueResourceKeys, cardReissueModelKeys);

                cardReissue.set(mockCardReissueResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(cardReissue, key)).toBeTruthy();
                    expect(cardReissue[key]).toEqual(mockCardReissueResource[key]);
                }
            });

        });

    });

})();