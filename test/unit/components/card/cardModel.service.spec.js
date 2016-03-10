(function () {
    "use strict";

    describe("A Card Model Service", function () {

        var _,
            card;

        beforeEach(function () {
            module("app.shared");
            module("app.components.card");

            inject(function (___, CardModel) {
                _ = ___;

                card = new CardModel();
            });
        });

        describe("has a set function that", function () {

            var mockCardResource = {
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

            beforeEach(inject(function () {
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

        describe("has a getStatusDisplayName function that", function () {

            describe("when the status is ACTIVE", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return 'Active'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Active");
                });
            });

            describe("when the status is SUSPENDED", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return 'Suspended'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Suspended");
                });
            });

            describe("when the status is TERMINATED", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return 'Terminated'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Terminated");
                });
            });

            describe("when the status is UNKNOWN", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });


            describe("when the method is unrecognized", function () {

                beforeEach(function () {
                    card.status = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });
        });

        describe("has an isActive function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return true", function () {
                    expect(card.isActive()).toBeTruthy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

        });

        describe("has an isSuspended function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return true", function () {
                    expect(card.isSuspended()).toBeTruthy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

        });

        describe("has an isTerminated function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return true", function () {
                    expect(card.isTerminated()).toBeTruthy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

        });

    });
})();