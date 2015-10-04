(function () {
    "use strict";

    describe("A Card Reissue Model Service", function () {

        var _,
            sharedGlobals,
            cardReissue;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.components.card");

            inject(function (CommonService, CardReissueModel, AccountModel, AddressModel, CardModel,
                             ShippingCarrierModel, ShippingMethodModel, _sharedGlobals_) {
                _ = CommonService._;
                sharedGlobals = _sharedGlobals_;

                cardReissue = TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel,
                    ShippingCarrierModel, ShippingMethodModel);
            });
        });

        describe("has a set function that", function () {

            var mockCardReissueResource,
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

        describe("has a hasDefaultCarrier function that", function () {

            it("should return true when account.cardShippingCarrier.default is true", function () {
                cardReissue.account.cardShippingCarrier.default = true;

                expect(cardReissue.hasDefaultCarrier()).toBeTruthy();
            });

            it("should return false when account.cardShippingCarrier.default is false", function () {
                cardReissue.account.cardShippingCarrier.default = false;

                expect(cardReissue.hasDefaultCarrier()).toBeFalsy();
            });
        });

        describe("has a getShippingMethodDisplayName function that", function () {

            describe("if a shipping method is given", function () {
                var shippingMethod;

                beforeEach(function () {
                    shippingMethod = TestUtils.getRandomValueFromArray(cardReissue.shippingMethods);
                });

                describe("if there is a default carrier", function () {

                    beforeEach(function () {
                        cardReissue.account.cardShippingCarrier.default = true;
                    });

                    describe("if the given shipping method is the regular shipping method", function () {

                        beforeEach(function () {
                            shippingMethod = cardReissue.account.regularCardShippingMethod;
                        });

                        it("should return the expected value", function () {
                            expect(cardReissue.getShippingMethodDisplayName(shippingMethod)).toEqual(shippingMethod.getDisplayName(false));
                        });
                    });

                    describe("if the given shipping method is NOT the regular shipping method", function () {

                        beforeEach(function () {
                            do {
                                shippingMethod = TestUtils.getRandomValueFromArray(cardReissue.shippingMethods);
                            }
                            while(shippingMethod === cardReissue.account.regularCardShippingMethod);
                        });

                        it("should return the expected value", function () {
                            expect(cardReissue.getShippingMethodDisplayName(shippingMethod))
                                .toEqual(cardReissue.account.cardShippingCarrier.getDisplayName() + " - " + shippingMethod.getDisplayName(false));
                        });
                    });
                });

                describe("if there is NOT a default carrier", function () {

                    beforeEach(function () {
                        cardReissue.account.cardShippingCarrier.default = false;
                    });

                    it("should return the expected value", function () {
                        expect(cardReissue.getShippingMethodDisplayName(shippingMethod)).toEqual(shippingMethod.getDisplayName(true));
                    });
                });
            });

            describe("if a shipping method is NOT given", function () {

                it("should use the selected shipping method", function () {
                    expect(cardReissue.getShippingMethodDisplayName()).toEqual(cardReissue.getShippingMethodDisplayName(cardReissue.selectedShippingMethod));
                });
            });
        });

        describe("has a getReissueReasonDisplayName function that", function () {

            beforeEach(function () {
                cardReissue.reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);
            });

            describe("if a reissue reason is given", function () {
                var reissueReason;

                describe("if the reissue reason is known", function () {

                    beforeEach(function () {
                        reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);
                    });

                    it("should return the expected display mapping", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[reissueReason.toUpperCase()];

                        expect(cardReissue.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is unknown", function () {

                    beforeEach(function () {
                        reissueReason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    it("should return unknown", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON.UNKNOWN;

                        expect(cardReissue.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is null", function () {

                    beforeEach(function () {
                        reissueReason = null;
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissue.reissueReason.toUpperCase()];

                        expect(cardReissue.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is undefined", function () {

                    beforeEach(function () {
                        reissueReason = undefined;
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissue.reissueReason.toUpperCase()];

                        expect(cardReissue.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is empty", function () {

                    beforeEach(function () {
                        reissueReason = "";
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissue.reissueReason.toUpperCase()];

                        expect(cardReissue.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });
            });

            describe("if the reissue reason is NOT given", function () {

                it("should return the display mapping for the current reissue reason", function () {
                    var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissue.reissueReason.toUpperCase()];

                    expect(cardReissue.getReissueReasonDisplayName()).toEqual(expectedMapping);
                });
            });
        });
    });

})();