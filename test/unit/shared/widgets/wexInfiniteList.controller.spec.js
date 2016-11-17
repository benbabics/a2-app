(function () {
    "use strict";

    describe("A WEX Infinite List Controller", function () {
      var $rootScope,
          $scope,
          $timeout,
          $q,
          $ionicScrollDelegate,
          wexInfiniteListService,
          ctrl,
          delegate,
          attrs,
          deferred,
          isGreeking = true;

        beforeEach(function () {
            delegate = {
              makeRequest:  jasmine.createSpy( "makeRequest" ),
              onError:      jasmine.createSpy( "onError" ),
              onResetItems: jasmine.createSpy( "onResetItems" )
            };

            inject(function (_$rootScope_, _$timeout_, _$q_, $controller) {
                $rootScope = _$rootScope_;
                $timeout   = _$timeout_;
                $q         = _$q_;
                deferred   = $q.defer();

                $ionicScrollDelegate   = jasmine.createSpyObj( "$ionicScrollDelegate", ["resize"] );
                wexInfiniteListService = jasmine.createSpy( "wexInfiniteListService" );

                // wexInfiniteListService is a spy of a constructor.
                // Below are spies for it's methods... is there a better way to do this?
                wexInfiniteListService.prototype.loadNextPage    = function() {};
                spyOn( wexInfiniteListService.prototype, "loadNextPage" ).and.returnValue( deferred.promise ); // expecting a promise
                wexInfiniteListService.prototype.resetCollection = function() {};
                spyOn( wexInfiniteListService.prototype, "resetCollection" ).and.returnValue( deferred.promise ); // expecting a promise
                // wexInfiniteListService.prototype.resetCollection = jasmine.createSpy( "resetCollection" );

                // create a scope object for us to use.
                $scope = $rootScope.$new();
                $scope.cacheKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                attrs = {
                    isGreeking: isGreeking,
                    cacheKey:   $scope.cacheKey
                };

                ctrl = $controller("WexInfiniteListController", {
                    $scope:                 $scope,
                    $attrs:                 attrs,
                    $ionicScrollDelegate:   $ionicScrollDelegate,
                    wexInfiniteListService: wexInfiniteListService
                });
            });
        });

        describe("has assigned $scope.infiniteScrollService a value that", function () {
            it("should have a new instance of wexInfiniteListService", function () {
                expect( wexInfiniteListService ).toHaveBeenCalled();
                expect( $scope.infiniteScrollService instanceof wexInfiniteListService ).toBeTruthy();
            });
        });

        describe("has a settings property that", function () {
            var greekingStates = [ 'true', false, 'false' ];

            beforeEach(function() {
              isGreeking = greekingStates.shift();
            });

            it("should be extended based on $attrs", function () {
                expect( ctrl.settings ).toEqual( attrs );
            });

            // testing various states of the isGreeking value of the settings property that is extended from $attrs
            // not sure how else to do this but by having an initial value of (boolean) true assigned to isGreeking
            // then having a beforeEach shift the greekingStates item and re-assign isGreeking for the
            // initialiation of the controller for the remaining tests below

            it("should assign isGreeking true when $attrs.isGreeking is 'true' (string)", function () {
                // IS THIS FAILING? Look at greekingStates array and make sure the item values correlate with order of tests
                expect( ctrl.settings.isGreeking ).toEqual( true );
            });
            it("should assign isGreeking false when $attrs.isGreeking is false (boolean)", function () {
                // IS THIS FAILING? Look at greekingStates array and make sure the item values correlate with order of tests
                expect( ctrl.settings.isGreeking ).toEqual( false );
                });
            it("should assign isGreeking false when $attrs.isGreeking is 'false' (string)", function () {
                // IS THIS FAILING? Look at greekingStates array and make sure the item values correlate with order of tests
                expect( ctrl.settings.isGreeking ).toEqual( false );
            });
        });

        describe("has an assignServiceDelegate function that", function () {
          beforeEach(function () {
            ctrl.assignServiceDelegate( delegate );
          });

          it("should extend the serviceDelegate with hooks", function () {
              expect( ctrl.serviceDelegate.makeRequest ).toBe( delegate.makeRequest );
              expect( ctrl.serviceDelegate.onError ).toBe( delegate.onError );
              expect( ctrl.serviceDelegate.onResetItems ).toBe( delegate.onResetItems );
          });
        });

        describe("has a loadNextPage function that", function () {
            var greekingStates = [ true, true, false ];

            beforeEach(function () {
                isGreeking = greekingStates.shift();
                spyOn($scope, "$broadcast");

                ctrl.assignServiceDelegate( delegate );
                $scope.loadNextPage();
            });

            it("should send a message to $scope.infiniteScrollService.loadNextPage", function () {
                expect( $scope.infiniteScrollService.loadNextPage ).toHaveBeenCalled();
            });
            it("should send a message to serviceDelegate.onError if it fails", function () {
                deferred.reject();
                $scope.$apply(); // call for deferred to work
                expect( ctrl.serviceDelegate.onError ).toHaveBeenCalled();
            });
            it("should send a message to $ionicScrollDelegate.resize if it is successful and settings.isGreeking is true", function () {
                // IS THIS FAILING? Look at greekingStates array and make sure the item values correlate with order of tests
                deferred.resolve();
                $scope.$apply(); // call for deferred to work
                $timeout.flush(); // call to flush timeout that delays rendering
                expect( $ionicScrollDelegate.resize ).toHaveBeenCalled();
            });
                it("should NOT send a message to $ionicScrollDelegate.resize if it is successful and settings.isGreeking is false", function () {
                  // IS THIS FAILING? Look at greekingStates array and make sure the item values correlate with order of tests
                deferred.resolve();
                $scope.$apply(); // call for deferred to work
                $timeout.flush(); // call to flush timeout that delays rendering
                expect( $ionicScrollDelegate.resize ).not.toHaveBeenCalled();
            });
            it("should broadcast the event 'scroll.refreshComplete' if it is successful", function () {
                deferred.resolve();
                $scope.$apply(); // call for deferred to work
                $timeout.flush(); // call to flush timeout that delays rendering
                expect( $scope.$broadcast ).toHaveBeenCalledWith( "scroll.refreshComplete" );
            });
        });

        describe("has a resetSearchResults function that", function () {
            beforeEach(function () {
                ctrl.assignServiceDelegate( delegate );
                $scope.resetSearchResults();
            });

            it("should send a message to serviceDelegate.onResetItems", function () {
                expect( ctrl.serviceDelegate.onResetItems ).toHaveBeenCalled();
            });
            it("should send a message to $scope.infiniteScrollService.resetCollection", function () {
              expect( $scope.infiniteScrollService.resetCollection ).toHaveBeenCalled();
            });
        })
    });

})();
