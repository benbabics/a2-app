(function () {
    "use strict";

    var $ionicHistory,
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $timeout,
        $ionicActionSheet,
        Navigation,
        ctrl,
        mockDriver;

    fdescribe("A Driver Detail Controller", () => {

        beforeEach(() => {

            // stub the routing and template loading
            module( $urlRouterProvider => $urlRouterProvider.deferIntercept() );
            module([ "$provide", _.partial( TestUtils.provideCommonMockDependencies, _ ) ]);
            module($provide => { $provide.value( "$ionicTemplateCache", () => {} ); });

            // mock dependencies
            Navigation        = jasmine.createSpyObj( "Navigation", [ "goToTransactionActivity" ] );
            $ionicHistory     = jasmine.createSpyObj( "$ionicHistory", [ "clearCache" ] );
            $ionicActionSheet = jasmine.createSpyObj( "$ionicActionSheet", [ "show" ] );

            inject(($controller, _$rootScope_, _$q_, _$state_, _$stateParams_, _$timeout_, DriverModel) => {
                $q           = _$q_;
                $state       = _$state_;
                $stateParams = _$stateParams_;
                $timeout     = _$timeout_;
                $rootScope   = _$rootScope_;
                $scope       = $rootScope.$new();

                mockDriver = TestUtils.getRandomDriver( DriverModel );
                $stateParams.driver = mockDriver;

                ctrl = $controller("DriverDetailController", {
                    $ionicHistory:     $ionicHistory,
                    $scope:            $scope,
                    $stateParams:      $stateParams,
                    $timeout:          $timeout,
                    $ionicActionSheet: $ionicActionSheet,
                    Navigation:        Navigation
                });
            });

            // setup mocks
            $ionicHistory.clearCache.and.returnValue( $q.resolve() );
        });

        it("should set the driver", () => {
            expect( ctrl.driver ).toEqual( mockDriver );
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

        xdescribe("has a goToTransactionActivity function that", () => {
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
                    filterValue: mockDriver.driverId
                });
            });
        });

    });

}());
