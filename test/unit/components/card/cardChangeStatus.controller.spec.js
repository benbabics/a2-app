(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $q,
        $state,
        CardManager,
        CardModel,
        Popup,
        PlatformUtil,
        LoadingIndicator,
        UserManager,
        mockCard,
        mockGlobals = {
            "CARD_CHANGE_STATUS": {
                "CONFIG": {
                    "ANALYTICS": {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "statuses"         : {
                        "activate" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "terminate": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "card"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationPopup": {
                        "contentMessages": {
                            "active"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "terminated": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "yesButton"      : TestUtils.getRandomStringThatIsAlphaNumeric(5),
                        "noButton"       : TestUtils.getRandomStringThatIsAlphaNumeric(5)
                    }
                }
            }
        },
        mockConfig = mockGlobals.CARD_CHANGE_STATUS.CONFIG,
        mockUser;

    describe("A Card Change Status Controller", function () {

        beforeEach(function () {

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", [
                "updateStatus"
            ]);

            Popup = jasmine.createSpyObj("Popup", [
                "displayConfirm"
            ]);

            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", [
                "begin",
                "complete"
            ]);

            PlatformUtil = jasmine.createSpyObj("PlatformUtil", [
                "waitForCordovaPlatform"
            ]);

            UserManager = jasmine.createSpyObj("UserManager", [
                "getUser"
            ]);

            $state = jasmine.createSpyObj("$state", [
                "go"
            ]);

            inject(function ($controller, _$rootScope_, _$q_, sharedGlobals, UserAccountModel, _CardModel_, UserModel) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                CardModel = _CardModel_;

                $scope = $rootScope.$new();

                mockCard = TestUtils.getRandomCard(CardModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
                mockGlobals.CARD = sharedGlobals.CARD;

                ctrl = $controller("CardChangeStatusController", {
                    $scope          : $scope,
                    $state          : $state,
                    globals         : mockGlobals,
                    card            : mockCard,
                    CardManager     : CardManager,
                    LoadingIndicator: LoadingIndicator,
                    PlatformUtil    : PlatformUtil,
                    Popup       : Popup,
                    UserManager     : UserManager
                });
            });

            //setup mocks
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set card to the given card object", function () {
            expect(ctrl.card).toEqual(mockCard);
        });

        it("should set cardStatuses to the expected constant values", function () {
            expect(ctrl.cardStatuses).toEqual(mockGlobals.CARD.STATUS);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockConfig);
        });

        describe("has a promptStatusChange function that", function () {
            var newStatus,
                confirmDeferred,
                updateStatusDeferred;

            beforeEach(function () {
                do {
                    newStatus = TestUtils.getRandomValueFromMap(mockGlobals.CARD.STATUS);
                }
                while (newStatus === mockCard.status);

                confirmDeferred = $q.defer();
                updateStatusDeferred = $q.defer();

                Popup.displayConfirm.and.returnValue(confirmDeferred.promise);
                CardManager.updateStatus.and.returnValue(updateStatusDeferred.promise);
            });

            beforeEach(function () {
                ctrl.promptStatusChange(newStatus);
            });

            it("should call Popup.displayConfirm with the expected values", function () {
                expect(Popup.displayConfirm).toHaveBeenCalledWith({
                    content             : mockConfig.confirmationPopup.contentMessages[newStatus],
                    okButtonText        : mockConfig.confirmationPopup.yesButton,
                    cancelButtonText    : mockConfig.confirmationPopup.noButton,
                    okButtonCssClass    : "button-primary",
                    cancelButtonCssClass: "button-secondary"
                });
            });

            describe("when the user confirms the change", function () {

                beforeEach(function () {
                    confirmDeferred.resolve(true);
                    $rootScope.$digest();
                });

                it("should call LoadingIndicator.begin", function () {
                    expect(LoadingIndicator.begin).toHaveBeenCalledWith();
                });

                it("should call CardManager.updateStatus with the expected values", function () {
                    expect(CardManager.updateStatus).toHaveBeenCalledWith(
                        mockUser.billingCompany.accountId,
                        mockCard.cardId,
                        newStatus
                    );
                });

                describe("when updating the card status is successful", function () {
                    var updatedCard;

                    beforeEach(function () {
                        updatedCard = new CardModel();
                        updatedCard.set(mockCard);
                        updatedCard.status = newStatus;
                    });

                    beforeEach(function () {
                        updateStatusDeferred.resolve(updatedCard);
                        $rootScope.$digest();
                    });

                    it("should redirect to card.changeStatus.confirmation", function () {
                        expect($state.go).toHaveBeenCalledWith("card.changeStatus.confirmation", {cardId: updatedCard.cardId});
                    });

                    it("should call LoadingIndicator.complete", function () {
                        expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                    });
                });

                describe("when updating the card status is NOT successful", function () {

                    beforeEach(function () {
                        updateStatusDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT redirect to card.changeStatus.confirmation", function () {
                        expect($state.go).not.toHaveBeenCalledWith("card.changeStatus.confirmation", jasmine.any(Object));
                    });

                    it("should call LoadingIndicator.complete", function () {
                        expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                    });
                });
            });

            describe("when the user denies the change", function () {

                beforeEach(function () {
                    confirmDeferred.resolve(false);
                    $rootScope.$digest();
                });

                it("should NOT call CardManager.updateStatus", function () {
                    expect(CardManager.updateStatus).not.toHaveBeenCalledWith();
                });

                it("should NOT redirect to card.changeStatus.confirmation", function () {
                    expect($state.go).not.toHaveBeenCalledWith("card.changeStatus.confirmation", jasmine.any(Object));
                });
            });
        });
    });
})();