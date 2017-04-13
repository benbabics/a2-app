(function () {
    "use strict";

    var $ionicHistory,
        $q,
        $rootScope,
        $scope,
        $state,
        $timeout,
        $ionicActionSheet,
        Navigation,
        ctrl,
        mockCard,
        CardManager,
        mockGlobals = {
            "CARD_DETAIL": {
                "CONFIG": {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cardNumber"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "standardEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "optionalEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "status"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "changeStatusButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reissueCardButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                }
            }
        },
        mockConfig = mockGlobals.CARD_DETAIL.CONFIG;

    describe("A Card Detail Controller", function () {

        beforeEach(function () {

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _)]);

            //mock dependencies
            Navigation        = jasmine.createSpyObj( "Navigation", [ "goToTransactionActivity" ] );
            $ionicActionSheet = jasmine.createSpyObj( "$ionicActionSheet", [ "show" ] );
            $ionicHistory     = jasmine.createSpyObj( "$ionicHistory", [ "clearCache" ] );
            CardManager       = jasmine.createSpyObj( "CardManager", [ "updateStatus" ] );

            inject(($controller, _$rootScope_, _$q_, _$state_, _$timeout_, CardModel) => {
                $q         = _$q_;
                $state     = _$state_;
                $timeout   = _$timeout_;
                $rootScope = _$rootScope_;
                $scope     = $rootScope.$new();

                mockCard = TestUtils.getRandomCard( CardModel );
                $state = _$state_;

                ctrl = $controller("CardDetailController", {
                    $ionicHistory:     $ionicHistory,
                    $rootScope:        $rootScope,
                    $scope:            $scope,
                    $timeout:          $timeout,
                    $ionicActionSheet: $ionicActionSheet,
                    Navigation:        Navigation,
                    card:              mockCard,
                    globals:           mockGlobals,
                    CardManager:       CardManager
                });

            });

            // setup mocks
            $ionicHistory.clearCache.and.returnValue($q.resolve());
            CardManager.updateStatus.and.callFake((accountId, cardId, newStatus) => {
                ctrl.card.status = newStatus;
                return $q.resolve();
            });
        });

        it("should set the card", () => {
            expect( ctrl.card ).toEqual( mockCard );
        });

        describe("has a handleClickChangeStatus function that", () => {
            beforeEach(() => {
                ctrl.handleClickChangeStatus();
                $rootScope.$digest();
            });

            it("should make a call to $ionicActionSheet.show()", () => {
                expect( $ionicActionSheet.show ).toHaveBeenCalled();
            });
        });

        describe("has a updateCardStatus function that", () => {
            it("should update vm.isChangeStatusLoading appropriately", () => {
                ctrl.updateCardStatus( 'ACTIVE' );
                expect( ctrl.isChangeStatusLoading ).toBe( true );
                $timeout.flush();
                expect( ctrl.isChangeStatusLoading ).toBe( false );
            });

            it("should update vm.card.status to the appropriate 'statusId'", () => {
                ctrl.updateCardStatus( 'ACTIVE' );
                $timeout.flush();
                expect( ctrl.card.status ).toEqual( 'ACTIVE' );

                ctrl.updateCardStatus( 'SUSPENDED' );
                $timeout.flush();
                expect( ctrl.card.status ).toEqual( 'SUSPENDED' );

                ctrl.updateCardStatus( 'TERMINATED' );
                $timeout.flush();
                expect( ctrl.card.status ).toEqual( 'TERMINATED' );
            });

            it("should update vm.displayStatusChangeBannerSuccess appropriately", () => {
                expect( ctrl.displayStatusChangeBannerSuccess ).toBe( false );
                ctrl.updateCardStatus( 'ACTIVE' );
                $timeout.flush();
                expect( ctrl.displayStatusChangeBannerSuccess ).toBe( true );
            });
        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                spyOn($state, "go").and.stub();

                ctrl.goToTransactionActivity();
                $rootScope.$digest();
            });

            it("should call $ionicHistory.clearCache with the expected values", function () {
                expect($ionicHistory.clearCache).toHaveBeenCalledWith(["transaction"]);
            });

            it("should call $state.go with the expected values", function () {
                expect($state.go).toHaveBeenCalledWith("transaction.filterBy", {
                    filterBy: "card",
                    filterValue: mockCard.cardId
                });
            });
        });

    });

}());
