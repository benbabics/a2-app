(function () {
    "use strict";

    var ctrl,
        $rootScope,
        $scope,
        $ionicHistory,
        $cordovaGoogleAnalytics,
        sharedGlobals,
        mockCardReissueDetails,
        mockGlobals = {
            "CARD_REISSUE_INPUTS": {
                "REISSUE_REASON": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG;

    describe("A Card Reissue Reason Input Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.components.account");

            //mock dependencies:
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack"]);
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", ["trackView"]);

            inject(function ($controller, _$rootScope_, _sharedGlobals_, $q, AddressModel, ShippingMethodModel,
                             CardReissueModel, CommonService, AccountModel, CardModel, ShippingCarrierModel) {
                $rootScope = _$rootScope_;
                sharedGlobals = _sharedGlobals_;

                $scope = $rootScope.$new();

                mockCardReissueDetails = TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);

                ctrl = $controller("CardReissueReasonInputController", {
                    $scope                 : $scope,
                    $ionicHistory          : $ionicHistory,
                    $cordovaGoogleAnalytics: $cordovaGoogleAnalytics,
                    globals                : mockGlobals,
                    cardReissueDetails     : mockCardReissueDetails
                });

                //setup spies
                spyOn(CommonService, "waitForCordovaPlatform").and.callFake(function(callback) {
                    //just execute the callback directly
                    return $q.when((callback || function() {})());
                });
            });

        });

        it("should set card to the given card object", function () {
            expect(ctrl.cardReissueDetails).toEqual(mockCardReissueDetails);
        });

        it("should set config to the expected constant values", function () {
            expect(ctrl.config).toEqual(mockGlobals.CARD_REISSUE_INPUTS.REISSUE_REASON.CONFIG);
        });

        describe("has a beforeEnter function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should call $cordovaGoogleAnalytics.trackView", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(mockConfig.ANALYTICS.pageName);
            });
        });

        describe("has a confirmSelection function that", function () {
            var reissueReason;

            beforeEach(function () {
                reissueReason = TestUtils.getRandomValueFromMap(sharedGlobals.CARD.REISSUE_REASON);

                ctrl.confirmSelection(reissueReason);
            });

            it("should set cardReissueDetails.reissueReason to the given reissue reason", function () {
                expect(ctrl.cardReissueDetails.reissueReason).toEqual(reissueReason);
            });

            it("should call $ionicHistory.goBack", function () {
                expect($ionicHistory.goBack).toHaveBeenCalledWith();
            });
        });
    });
})();