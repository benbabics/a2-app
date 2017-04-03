(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        $timeout,
        _,
        filter,
        ElementUtil,
        DriverManager,
        UserManager,
        UserModel,
        UserAccountModel,
        DriverModel,
        Logger,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        globals,
        config,
        self,
        fetchDriversDeferred,
        driversActive,
        driversTerminated;

    describe("A Driver List Controller", () => {

        beforeEach(() => {
            self = this;

            // mock deps
            UserManager   = jasmine.createSpyObj( "UserManager", [ "getUser" ] );
            DriverManager = jasmine.createSpyObj( "DriverManager", [ "fetchDrivers", "getDrivers" ] );
            ElementUtil   = jasmine.createSpyObj( "ElementUtil", [ "getFocusedView", "resetInfiniteList" ] );

            // stub the routing and template loading
            module( "app.shared" );
            module( "app.components", $provide => {} );

            // stub the routing and template loading
            module( $urlRouterProvider => $urlRouterProvider.deferIntercept() );

            module($provide => {
                $provide.value( "$ionicTemplateCache", () => {} );
            });

            inject((___, _$q_, _$rootScope_, _$timeout_, $controller, _globals_, _UserModel_, _UserAccountModel_, _DriverModel_, _filterFilter_, _Logger_) => {
                _                = ___;
                $q               = _$q_;
                $timeout         = _$timeout_;
                $rootScope       = _$rootScope_;
                globals          = _globals_;
                config           = globals.DRIVER_LIST.CONFIG;
                UserModel        = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                DriverModel      = _DriverModel_;
                filter           = _filterFilter_;
                Logger           = _Logger_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("DriverListController", {
                    _:             _,
                    $scope:        $scope,
                    globals:       globals,
                    UserManager:   UserManager,
                    DriverManager: DriverManager,
                    Logger:        Logger
                });
            });

            // setup spies
            resolveHandler = jasmine.createSpy( "resolveHandler" );
            rejectHandler  = jasmine.createSpy( "rejectHandler" );

            // setup mocks
            mockUser = TestUtils.getRandomUser( UserModel, UserAccountModel );
            UserManager.getUser.and.returnValue( mockUser );

            fetchDriversDeferred = $q.defer();
            DriverManager.fetchDrivers.and.returnValue( fetchDriversDeferred.promise );

            // mock data
            driversActive = populateDrivers([
                { firstName: "Alan",    lastName: "Allens-Active",   promptId: "111111", status: "ACTIVE" },
                { firstName: "Brandon", lastName: "Braindons-Active", promptId: "222222", status: "ACTIVE" },
                { firstName: "Carl",    lastName: "Karls-Active",    promptId: "333333", status: "ACTIVE" }
            ]);

            driversTerminated = populateDrivers([
                { firstName: "Alan",    lastName: "Allens-Terminated",   promptId: "111111", status: "TERMINATED" },
                { firstName: "Brandon", lastName: "Braindons-Terminated", promptId: "222222", status: "TERMINATED" },
                { firstName: "Carl",    lastName: "Karls-Terminated",    promptId: "333333", status: "TERMINATED" }
            ]);
        });

        afterEach(() => {
            $rootScope =
            $scope =
            $q =
            $timeout =
            filter =
            ElementUtil =
            DriverManager =
            UserManager =
            UserModel =
            UserAccountModel =
            DriverModel =
            ctrl =
            resolveHandler =
            rejectHandler =
            mockUser =
            globals =
            config =
            self =
            fetchDriversDeferred =
            driversActive =
            driversTerminated = null;
        });

        describe("has an activate function that", () => {
            it("should have infiniteListController methods on $scope", () => {
                expect( $scope.loadNextPage ).toBeDefined();
                expect( $scope.resetSearchResults ).toBeDefined();
            });

            it("should have infiniteScrollService defined on $scope", () => {
                expect( $scope.infiniteScrollService ).toBeDefined();
            });

            it("should have vm.drivers equal model", () => {
                expect( ctrl.drivers ).toEqual( $scope.infiniteScrollService.model );
            });

            it("should have vm.drivers divided into 'active' and 'terminated' collections", () => {
                expect( ctrl.drivers.active ).toEqual( [] );
                expect( ctrl.drivers.terminated ).toEqual( [] );
            });
        });

        describe("has a handleMakeRequest function that", () => {
            beforeEach(() => {
                $scope.loadNextPage().then( resolveHandler );
                fetchDriversDeferred.resolve([ ...driversActive, ...driversTerminated ]);
                $rootScope.$digest();
            });

            it("should send a message to DriverManager.fetchDrivers with the expected params", () => {
                expect( DriverManager.fetchDrivers ).toHaveBeenCalledWith( mockUser.billingCompany.accountId );
            });

            it("should call resolveHandler when resolved", () => {
                expect( resolveHandler ).toHaveBeenCalled();
            });
        });

        describe("has divided drivers into 'active' and 'terminated' collections", () => {
            beforeEach(() => {
                fetchDriversDeferred.resolve([ ...driversActive, ...driversTerminated ]);
                DriverManager.getDrivers.and.returnValue([ ...driversActive, ...driversTerminated ]);
                $scope.loadNextPage();
                $rootScope.$digest();
                $timeout.flush();
            });

            it("should have populated the vm.drivers.active collection", () => {
                expect( ctrl.drivers.active.length ).toEqual( driversActive.length );
                expect( getDriversDetails(ctrl.drivers.active) ).toEqual( getDriversDetails(driversActive) );
            });

            it("should have populated the vm.drivers.terminated collection", () => {
                expect( ctrl.drivers.terminated.length ).toEqual( driversTerminated.length );
                expect( getDriversDetails(ctrl.drivers.terminated) ).toEqual( getDriversDetails(driversTerminated) );
            });
        });

        describe("has driversComparator function that", () => {
            it("should filter search term by firstName", () => {
                // First Names: Alan, Brandon, Carl
                let results = filter( driversActive, 'a', ctrl.driversComparator );
                expect( getDriversDetails(results) ).toEqual( getDriversDetails(driversActive) );

                results = filter( driversActive, 'all', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[0]) );

                results = filter( driversActive, 'brAN', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[1]) );

                results = filter( driversActive, 'Car', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[2]) );

                results = filter( driversActive, 'Thomas', ctrl.driversComparator );
                expect( results ).toEqual( [] );
            });

            it("should filter search term by lastName", () => {
                // Last Names: Allens, Braindons, Karls
                let results = filter( driversActive, '-ACTIVE', ctrl.driversComparator );
                expect( getDriversDetails(results) ).toEqual( getDriversDetails(driversActive) );

                results = filter( driversActive, 'alle', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[0]) );

                results = filter( driversActive, 'brAIN', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[1]) );

                results = filter( driversActive, 'Kar', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[2]) );

                results = filter( driversActive, 'Fran', ctrl.driversComparator );
                expect( results ).toEqual( [] );
            });

            it("should filter search term by promptId", () => {
                // Driver Id's: 111111, 222222, 333333
                let results = filter( driversActive, '1', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[0]) );

                results = filter( driversActive, '222', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[1]) );

                results = filter( driversActive, '333333', ctrl.driversComparator );
                expect( getDriverDetails(results[0]) ).toEqual( getDriverDetails(driversActive[2]) );

                results = filter( driversActive, '012345', ctrl.driversComparator );
                expect( results ).toEqual( [] );
            });
        });
    });


    // helper methods
    function populateDrivers(attrs = []) {
        return attrs.map( populateDriver );
    }
    function populateDriver(data = {}) {
        let model = new DriverModel();
        model.set( data );
        return model;
    }

    function getDriversDetails(drivers = []) {
        return _.map( drivers, getDriverDetails );
    }
    function getDriverDetails(driver = {}) {
        return _.pick( driver, 'firstName', 'lastName', 'driverId' );
    }
}());
