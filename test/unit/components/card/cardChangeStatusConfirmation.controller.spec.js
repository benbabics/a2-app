(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        Navigation,
        sharedGlobals,
        mockCard,
        mockGlobals = {
            "CARD_CHANGE_STATUS_CONFIRMATION": {
                "CONFIG": {
                    "ANALYTICS": {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationMessages": {
                        "active"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "terminated": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "cardNumber"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "standardEmbossing"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "optionalEmbossing"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "status"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cards"               : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockConfig = mockGlobals.CARD_CHANGE_STATUS_CONFIRMATION.CONFIG;

    describe("A CardChangeStatusConfirmationController", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");

            //mock dependencies
            Navigation = jasmine.createSpyObj("Navigation", ["goToCards"]);

            inject(function ($controller, _$rootScope_, $q, _sharedGlobals_, CardModel) {
                $rootScope = _$rootScope_;
                sharedGlobals = _sharedGlobals_;

                $scope = $rootScope.$new();

                mockCard = TestUtils.getRandomCard(CardModel);

                ctrl = $controller("CardChangeStatusConfirmationController", {
                    $scope    : $scope,
                    globals   : mockGlobals,
                    card      : mockCard,
                    Navigation: Navigation
                });

            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.card).toEqual(mockCard);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockConfig);
        });

        describe("has a getConfirmationMessage function that", function () {

            describe("when the card status is active", function () {

                beforeEach(function () {
                    mockCard.status = sharedGlobals.CARD.STATUS.ACTIVE;
                });

                it("should return the expected message", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual(mockConfig.confirmationMessages.active);
                });
            });

            describe("when the card status is terminated", function () {

                beforeEach(function () {
                    mockCard.status = sharedGlobals.CARD.STATUS.TERMINATED;
                });

                it("should return the expected message", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual(mockConfig.confirmationMessages.terminated);
                });
            });

            describe("when the card status is suspended", function () {

                beforeEach(function () {
                    mockCard.status = sharedGlobals.CARD.STATUS.SUSPENDED;
                });

                it("should return an empty string", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual("");
                });
            });

            describe("when the card status is null", function () {

                beforeEach(function () {
                    mockCard.status = null;
                });

                it("should return an empty string", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual("");
                });
            });

            describe("when the card status is undefined", function () {

                beforeEach(function () {
                    mockCard.status = undefined;
                });

                it("should return an empty string", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual("");
                });
            });

            describe("when the card status is empty", function () {

                beforeEach(function () {
                    mockCard.status = "";
                });

                it("should return an empty string", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual("");
                });
            });

            describe("when the card status is unrecognized", function () {

                beforeEach(function () {
                    mockCard.status = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return an empty string", function () {
                    expect(ctrl.getConfirmationMessage()).toEqual("");
                });
            });
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
