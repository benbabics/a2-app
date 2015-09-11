(function () {
    "use strict";

    describe("A Card Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.card");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var card,
                mockCardResource = {
                    cardId               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    accountId            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    cardType             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    embossedAccountNumber: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    embossedCardNumber   : TestUtils.getRandomStringThatIsAlphaNumeric(5),
                    embossingValue1      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    embossingValue2      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    embossingValue3      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    status               : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                cardModelKeys,
                cardResourceKeys;

            beforeEach(inject(function (CardModel) {
                card = new CardModel();

                // set all values to "default" to more easily detect any changes
                for (var property in card) {
                    if (_.has(card, property)) {
                        card[property] = "default";
                    }
                }

                cardModelKeys = _.keys(card);
                cardResourceKeys = _.keys(mockCardResource);
            }));

            it("should set the CardModel object with the fields from the passed in cardResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(cardModelKeys, cardResourceKeys);

                card.set(mockCardResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(card[key]).toEqual(mockCardResource[key]);
                }
            });

            it("should NOT change the CardModel object fields that the cardResource object does not have", function () {
                var key,
                    keysDifference = _.difference(cardModelKeys, cardResourceKeys);

                card.set(mockCardResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(card[key]).toEqual("default");
                }
            });

            it("should extend the CardModel object with the fields from the passed in cardResource object that the CardModel does not have", function () {
                var key,
                    keysDifference = _.difference(cardResourceKeys, cardModelKeys);

                card.set(mockCardResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(card, key)).toBeTruthy();
                    expect(card[key]).toEqual(mockCardResource[key]);
                }
            });
        });
    });
})();