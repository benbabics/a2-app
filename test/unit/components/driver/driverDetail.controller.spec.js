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
        mockDriver,
        DriverManager,
        AnalyticsUtil,
        resolveHandler,
        mockGlobals = {
            "DRIVER_DETAILS": {
                "CONFIG": {
                    "ANALYTICS"         : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "views": {
                            "statusOptionsOpen":    TestUtils.getRandomStringThatIsAlphaNumeric(5),
                            "statusOptionsSuccess": TestUtils.getRandomStringThatIsAlphaNumeric(5)
                        },
                        "events": {
                            "statusOptionActive":     [ TestUtils.getRandomStringThatIsAlphaNumeric(5) ],
                            "statusOptionTerminated": [ TestUtils.getRandomStringThatIsAlphaNumeric(5) ],
                            "navigateTransactions":   [ TestUtils.getRandomStringThatIsAlphaNumeric(5) ]
                        }
                    }
                }
            }
        };

    describe("A Driver Detail Controller", () => {

        beforeEach(() => {

            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value( "$ionicTemplateCache", function () {} );
                $provide.value( "AnalyticsUtil", AnalyticsUtil );
            });

            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _)]);

            // mock dependencies
            Navigation        = jasmine.createSpyObj( "Navigation", [ "goToTransactionActivity" ] );
            $ionicHistory     = jasmine.createSpyObj( "$ionicHistory", [ "clearCache" ] );
            $ionicActionSheet = jasmine.createSpyObj( "$ionicActionSheet", [ "show" ] );
            DriverManager     = jasmine.createSpyObj( "DriverManager", [ "updateStatus" ] );

            inject(($controller, _$rootScope_, _$q_, _$state_, _$timeout_, DriverModel) => {
                $q            = _$q_;
                $state        = _$state_;
                $timeout      = _$timeout_;
                $rootScope    = _$rootScope_;
                $scope        = $rootScope.$new();

                mockDriver = TestUtils.getRandomDriver( DriverModel );

                ctrl = $controller("DriverDetailController", {
                    $ionicHistory:     $ionicHistory,
                    $rootScope:        $rootScope,
                    $scope:            $scope,
                    $timeout:          $timeout,
                    $ionicActionSheet: $ionicActionSheet,
                    Navigation:        Navigation,
                    driver:            mockDriver,
                    DriverManager:     DriverManager,
                    globals:           mockGlobals
                });
            });

            // setup mocks
            $ionicHistory.clearCache.and.returnValue( $q.resolve() );
            DriverManager.updateStatus.and.callFake((accountId, driverId, newStatus) => {
                ctrl.driver.status = newStatus;
                return $q.resolve();
            });
        });

        it("should set the driver", () => {
            expect( ctrl.driver ).toEqual( mockDriver );
        });

        describe("has a updateDriverStatus function that", () => {
            it("should update vm.isChangeStatusLoading appropriately", () => {
                ctrl.updateDriverStatus( 'ACTIVE' );
                expect( ctrl.isChangeStatusLoading ).toBe( true );
                $timeout.flush();
                expect( ctrl.isChangeStatusLoading ).toBe( false );
            });

            it("should update vm.driver.status to the appropriate 'statusId'", () => {
                ctrl.updateDriverStatus( 'ACTIVE' );
                $timeout.flush();
                expect( ctrl.driver.status ).toEqual( 'ACTIVE' );

                ctrl.updateDriverStatus( 'TERMINATED' );
                $timeout.flush();
                expect( ctrl.driver.status ).toEqual( 'TERMINATED' );
            });

            it("should update vm.displayStatusChangeBannerSuccess appropriately", () => {
                expect( ctrl.displayStatusChangeBannerSuccess ).toBe( false );
                ctrl.updateDriverStatus( 'ACTIVE' );
                $timeout.flush();
                expect( ctrl.displayStatusChangeBannerSuccess ).toBe( true );
            });
        });

        describe("has a goToTransactionActivity function that", () => {
            beforeEach(() => {
                spyOn( $state, "go" ).and.stub();

                ctrl.goToTransactionActivity();
                $rootScope.$digest();
            });

            it("should call $ionicHistory.clearCache with the expected values", () => {
                expect( $ionicHistory.clearCache ).toHaveBeenCalledWith([ "transaction" ]);
            });

            it("should call $state.go with the expected values", () => {
                expect( $state.go ).toHaveBeenCalledWith("transaction.filterBy", {
                    filterBy:    "driver",
                    filterValue: mockDriver.promptId
                });
            });
        });

    });

}());
