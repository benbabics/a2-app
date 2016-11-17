(function () {
    "use strict";

    describe("A Card Reissue Model Service", function () {

        var _,
            ShippingMethodModel,
            sharedGlobals,
            cardReissueDetails;

        beforeEach(function () {

            inject(function (___, CardReissueModel, AccountModel, AddressModel, CardModel,
                             ShippingCarrierModel, _ShippingMethodModel_, _sharedGlobals_) {
                _ = ___;
                sharedGlobals = _sharedGlobals_;
                ShippingMethodModel = _ShippingMethodModel_;

                cardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel,
                    ShippingCarrierModel, ShippingMethodModel);
            });
        });

        describe("has a hasDefaultCarrier function that", function () {

            it("should return true when account.cardShippingCarrier.accountDefault is true", function () {
                cardReissueDetails.account.cardShippingCarrier.accountDefault = true;

                expect(cardReissueDetails.hasDefaultCarrier()).toBeTruthy();
            });

            it("should return false when account.cardShippingCarrier.accountDefault is false", function () {
                cardReissueDetails.account.cardShippingCarrier.accountDefault = false;

                expect(cardReissueDetails.hasDefaultCarrier()).toBeFalsy();
            });
        });

        describe("has a getShippingMethodDisplayName function that", function () {

            describe("if a shipping method is given", function () {
                var shippingMethod;

                beforeEach(function () {
                    shippingMethod = TestUtils.getRandomValueFromArray(cardReissueDetails.shippingMethods);
                });

                describe("if there is a default carrier", function () {

                    beforeEach(function () {
                        cardReissueDetails.account.cardShippingCarrier.accountDefault = true;
                    });

                    describe("if the given shipping method is the regular shipping method", function () {

                        beforeEach(function () {
                            shippingMethod = cardReissueDetails.account.regularCardShippingMethod;
                        });

                        it("should return the expected value", function () {
                            expect(cardReissueDetails.getShippingMethodDisplayName(shippingMethod)).toEqual(shippingMethod.getDisplayName(false));
                        });
                    });

                    describe("if the given shipping method is NOT the regular shipping method", function () {

                        beforeEach(function () {
                            do {
                                shippingMethod = TestUtils.getRandomValueFromArray(cardReissueDetails.shippingMethods);
                            }
                            while(shippingMethod === cardReissueDetails.account.regularCardShippingMethod);
                        });

                        it("should return the expected value", function () {
                            expect(cardReissueDetails.getShippingMethodDisplayName(shippingMethod))
                                .toEqual(cardReissueDetails.account.cardShippingCarrier.getDisplayName() + " - " + shippingMethod.getDisplayName(false));
                        });
                    });
                });

                describe("if there is NOT a default carrier", function () {

                    beforeEach(function () {
                        cardReissueDetails.account.cardShippingCarrier.accountDefault = false;
                    });

                    it("should return the expected value", function () {
                        expect(cardReissueDetails.getShippingMethodDisplayName(shippingMethod)).toEqual(shippingMethod.getDisplayName(true));
                    });
                });
            });

            describe("if a shipping method is NOT given", function () {

                it("should use the selected shipping method", function () {
                    expect(cardReissueDetails.getShippingMethodDisplayName()).toEqual(cardReissueDetails.getShippingMethodDisplayName(cardReissueDetails.selectedShippingMethod));
                });
            });
        });

        describe("has a getReissueReasonDisplayName function that", function () {

            beforeEach(function () {
                cardReissueDetails.reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);
            });

            describe("if a reissue reason is given", function () {
                var reissueReason;

                describe("if the reissue reason is known", function () {

                    beforeEach(function () {
                        reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);
                    });

                    it("should return the expected display mapping", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[reissueReason.toUpperCase()];

                        expect(cardReissueDetails.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is unknown", function () {

                    beforeEach(function () {
                        reissueReason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    it("should return unknown", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON.UNKNOWN;

                        expect(cardReissueDetails.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is null", function () {

                    beforeEach(function () {
                        reissueReason = null;
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissueDetails.reissueReason.toUpperCase()];

                        expect(cardReissueDetails.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is undefined", function () {

                    beforeEach(function () {
                        reissueReason = undefined;
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissueDetails.reissueReason.toUpperCase()];

                        expect(cardReissueDetails.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });

                describe("if the reissue reason is empty", function () {

                    beforeEach(function () {
                        reissueReason = "";
                    });

                    it("should return the display mapping for the current reissue reason", function () {
                        var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissueDetails.reissueReason.toUpperCase()];

                        expect(cardReissueDetails.getReissueReasonDisplayName(reissueReason)).toEqual(expectedMapping);
                    });
                });
            });

            describe("if the reissue reason is NOT given", function () {

                it("should return the display mapping for the current reissue reason", function () {
                    var expectedMapping = sharedGlobals.CARD.DISPLAY_MAPPINGS.REISSUE_REASON[cardReissueDetails.reissueReason.toUpperCase()];

                    expect(cardReissueDetails.getReissueReasonDisplayName()).toEqual(expectedMapping);
                });
            });
        });

        describe("has a getDefaultShippingMethod function that", function () {

            beforeEach(function () {
                cardReissueDetails.shippingMethods.forEach(function(shippingMethod) {
                    shippingMethod.default = false;
                });
            });

            describe("when there is a default shipping method", function () {
                var defaultShippingMethod;

                beforeEach(function () {
                    defaultShippingMethod = TestUtils.getRandomValueFromArray(cardReissueDetails.shippingMethods);
                    defaultShippingMethod.default = true;
                });

                it("should return the default shipping method", function () {
                    expect(cardReissueDetails.getDefaultShippingMethod()).toEqual(defaultShippingMethod);
                });
            });

            describe("when there is NOT a default shipping method", function () {

                describe("when there is a regular shipping method", function () {

                    beforeEach(function () {
                        cardReissueDetails.shippingMethods.push(cardReissueDetails.account.regularCardShippingMethod);
                    });

                    it("should return the regular shipping method", function () {
                        expect(cardReissueDetails.getDefaultShippingMethod()).toEqual(cardReissueDetails.account.regularCardShippingMethod);
                    });
                });

                describe("when there is NOT a regular shipping method", function () {

                    beforeEach(function () {
                        _.remove(cardReissueDetails.shippingMethods, {id: cardReissueDetails.account.regularCardShippingMethod.id});
                    });

                    describe("when there is at least one shipping method", function () {

                        beforeEach(function () {
                            var shippingMethod = TestUtils.getRandomShippingMethod(ShippingMethodModel);
                            shippingMethod.default = false;

                            cardReissueDetails.shippingMethods.push(shippingMethod);
                        });

                        it("should return the first shipping method", function () {
                            expect(cardReissueDetails.getDefaultShippingMethod()).toEqual(cardReissueDetails.shippingMethods[0]);
                        });
                    });

                    describe("when there are no shipping methods", function () {

                        beforeEach(function () {
                            cardReissueDetails.shippingMethods = [];
                        });

                        it("should return null", function () {
                            expect(cardReissueDetails.getDefaultShippingMethod()).toEqual(null);
                        });
                    });
                });
            });
        });

        describe("has a hasRegularShippingMethod method that", function () {

            describe("when there is a Regular shipping method", function () {

                beforeEach(function () {
                    cardReissueDetails.shippingMethods.push(cardReissueDetails.account.regularCardShippingMethod);
                });

                it("should return true", function () {
                    expect(cardReissueDetails.hasRegularShippingMethod()).toBeTruthy();
                });
            });

            describe("when there is NOT a Regular shipping method", function () {

                beforeEach(function () {
                    _.remove(cardReissueDetails.shippingMethods, {id: cardReissueDetails.account.regularCardShippingMethod.id});
                });

                it("should return false", function () {
                    expect(cardReissueDetails.hasRegularShippingMethod()).toBeFalsy();
                });
            });
        });
    });

})();