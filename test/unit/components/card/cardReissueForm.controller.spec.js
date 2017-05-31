(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $q,
        $state,
        $ionicHistory,
        $window,
        CardManager,
        CardModel,
        Popup,
        LoadingIndicator,
        UserManager,
        AddressModel,
        ShippingMethodModel,
        sharedGlobals,
        mockCardReissueDetails,
        mockUser,
        mockGlobals = {
            "CARD_REISSUE": {
                "CONFIG": {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "shippingAddress"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "shippingMethod"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reissueReason"      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "selectReissueReason": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "submitButton"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "instructionalText"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "poBoxText"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "confirmationPopup"  : {
                        "message": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "buttons": [ TestUtils.getRandomStringThatIsAlphaNumeric(10) ]
                    }
                }
            }
        },
        mockConfig = mockGlobals.CARD_REISSUE.CONFIG;

    describe("A Card Reissue Form Controller", function () {

        beforeEach(function () {

            //mock dependencies:
            CardManager = jasmine.createSpyObj("CardManager", [
                "reissue"
            ]);

            UserManager = jasmine.createSpyObj("UserManager", [
                "getUser"
            ]);

            $state = jasmine.createSpyObj("$state", [
                "go"
            ]);

            $ionicHistory = jasmine.createSpyObj("$ionicHistory", [
                "nextViewOptions"
            ]);

            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);

            Popup = jasmine.createSpyObj("Popup", ["displayConfirm"]);

            inject(function ($controller, _$window_, _$rootScope_, _$q_, _sharedGlobals_, _AddressModel_, _ShippingMethodModel_,
                             CardReissueModel, AccountModel, _CardModel_, ShippingCarrierModel, UserModel,
                             UserAccountModel, PlatformUtil) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                sharedGlobals = _sharedGlobals_;
                AddressModel = _AddressModel_;
                ShippingMethodModel = _ShippingMethodModel_;
                CardModel = _CardModel_;
                $window = _$window_;

                $scope = $rootScope.$new();

                PlatformUtil.waitForCordovaPlatform = jasmine.createSpy("waitForCordovaPlatform").and.callFake(function(callback) {
                    let noop = () => {};
                    return $q.when( (callback || noop)() ); // just execute the callback directly
                });

                let spyNotification = jasmine.createSpyObj( '$window.navigator.notification', ['confirm'] );
                $window.navigator.notification = spyNotification;

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);

                ctrl = $controller("CardReissueFormController", {
                    $scope            : $scope,
                    $state            : $state,
                    $ionicHistory     : $ionicHistory,
                    globals           : mockGlobals,
                    cardReissueDetails: mockCardReissueDetails,
                    CardManager       : CardManager,
                    LoadingIndicator  : LoadingIndicator,
                    Popup             : Popup,
                    UserManager       : UserManager,
                    $window           : $window
                });
            });

            //setup mocks
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set card to the given card object", function () {
            expect(ctrl.cardReissueDetails).toEqual(mockCardReissueDetails);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE.CONFIG);
        });

        describe("has an isFormComplete function that", function () {

            describe("when the shipping address is null", function () {

                beforeEach(function () {
                    mockCardReissueDetails.shippingAddress = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissueDetails.shippingAddress;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address is empty", function () {

                beforeEach(function () {
                    mockCardReissueDetails.shippingAddress = {};
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is null", function () {

                beforeEach(function () {
                    mockCardReissueDetails.selectedShippingMethod = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissueDetails.selectedShippingMethod;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the selected shipping method is empty", function () {

                beforeEach(function () {
                    mockCardReissueDetails.selectedShippingMethod = {};
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is null", function () {

                beforeEach(function () {
                    mockCardReissueDetails.reissueReason = null;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is undefined", function () {

                beforeEach(function () {
                    delete mockCardReissueDetails.reissueReason;
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the reissue reason is empty", function () {

                beforeEach(function () {
                    mockCardReissueDetails.reissueReason = "";
                });

                it("should return false", function () {
                    expect(ctrl.isFormComplete()).toBeFalsy();
                });
            });

            describe("when the shipping address, selected shipping method, and reissue reason are valid", function () {

                beforeEach(function () {
                    mockCardReissueDetails.shippingAddress = TestUtils.getRandomAddress(AddressModel);
                    mockCardReissueDetails.selectedShippingMethod = TestUtils.getRandomShippingMethod(ShippingMethodModel);
                    mockCardReissueDetails.reissueReason = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return true", function () {
                    expect(ctrl.isFormComplete()).toBeTruthy();
                });
            });
        });

        describe("has a handleReissueConfirm function that", function () {
            var confirmDeferred,
                reissueDeferred;

            beforeEach(function () {
                confirmDeferred = $q.defer();
                reissueDeferred = $q.defer();

                $window.navigator.notification.confirm.and.returnValue(confirmDeferred.promise);
                Popup.displayConfirm.and.returnValue(confirmDeferred.promise);
                CardManager.reissue.and.returnValue(reissueDeferred.promise);
            });

            beforeEach(function () {
                ctrl.handleReissueConfirm();
                $rootScope.$digest();
            });

            it("should call Popup.displayConfirm with the expected values", function () {
                expect( $window.navigator.notification.confirm ).toHaveBeenCalled();
            });

            describe("when the user confirms the change", function () {

                beforeEach(function () {
                    spyOn( ctrl, "displayReissueConfirm" ).and.returnValue( confirmDeferred.promise );
                    ctrl.handleReissueConfirm(); // do again now that we're mocking "displayReissueConfirm"
                    confirmDeferred.resolve(true);
                    $rootScope.$digest();
                });

                it("should call LoadingIndicator.begin", function () {
                    expect(LoadingIndicator.begin).toHaveBeenCalledWith();
                });

                it("should call CardManager.reissue with the expected values", function () {
                    expect(CardManager.reissue).toHaveBeenCalledWith(
                        mockUser.billingCompany.accountId,
                        mockCardReissueDetails.originalCard.cardId,
                        mockCardReissueDetails.reissueReason,
                        mockCardReissueDetails.selectedShippingMethod.id
                    );
                });

                describe("when reissuing the card is successful", function () {
                    var updatedCard;

                    beforeEach(function () {
                        updatedCard = TestUtils.getRandomCard(CardModel);
                    });

                    beforeEach(function () {
                        // as soon as CardManager.reissue resolves, force refreshListDeferredDelegate to resolve for tests
                        CardManager.reissue().then( () => ctrl.refreshListDeferredDelegate.resolve() );

                        reissueDeferred.resolve(updatedCard);
                        $rootScope.$digest();
                    });

                    it("should set reissuedCard to the updated card", function () {
                        expect(mockCardReissueDetails.reissuedCard).toEqual(updatedCard);
                    });

                    it("should redirect to card.reissue.confirmation", function () {
                        expect($state.go).toHaveBeenCalledWith("card.detail", {
                            isReissued: true,
                            cardId: mockCardReissueDetails.reissuedCard.cardId
                        });
                    });

                    it("should call LoadingIndicator.complete", function () {
                        expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                    });
                });

                describe("when reissuing the card is NOT successful", function () {

                    beforeEach(function () {
                        reissueDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT redirect to card.changeStatus.confirmation", function () {
                        expect($state.go).not.toHaveBeenCalledWith("card.reissue.confirmation", jasmine.any(Object));
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

                it("should NOT call CardManager.reissue", function () {
                    expect(CardManager.reissue).not.toHaveBeenCalledWith();
                });

                it("should NOT redirect to card.reissue.confirmation", function () {
                    expect($state.go).not.toHaveBeenCalledWith("card.reissue.confirmation", jasmine.any(Object));
                });
            });
        });
    });
})();