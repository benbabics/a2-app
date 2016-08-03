(function () {
    "use strict";

    describe("A WEX Infinite List Service", function () {

      var wexInfiniteListService,
          _,
          $q,
          $scope,
          deferred,
          delegate,
          mockItems;

      beforeEach(function () {
          module( "app.shared" );

          mockItems = [ {name: 'a'}, {name: 'b'}, {name: 'c'} ];
          delegate  = { makeRequest: function() {} };

          inject(function (___, _$rootScope_, _$q_, _wexInfiniteListService_) {
              _                      = ___;
              $q                     = _$q_;
              $scope                 = _$rootScope_.$new();
              deferred               = $q.defer();
              wexInfiniteListService = _wexInfiniteListService_;

              spyOn( delegate, "makeRequest" ).and.returnValue( deferred.promise ); // expecting a promise
          });
      });

      describe("is a constructor that", function () {
          describe("accepts a delegate as the first argument and", function () {
            it("requires the delegate has a 'makeRequest' method", function () {
                expect(function() { new wexInfiniteListService() }).toThrow();
                expect(function() { new wexInfiniteListService({}) }).toThrow();
                expect(function() { new wexInfiniteListService(delegate) }).not.toThrow();
            });
            it("assigns a 'delegate' property to the instance", function () {
                var instance = new wexInfiniteListService( delegate );
                expect( instance.delegate ).toBeDefined();
            })
          });

          describe("accepts an options hash as the second argument and", function () {
              it("creates a unique model from the 'cacheKey' property", function () {
                  var instance1 = new wexInfiniteListService( delegate, { cacheKey: 'foo' } ),
                      instance2 = new wexInfiniteListService( delegate, { cacheKey: 'bar' } );

                  expect( instance1.model ).not.toBe( instance2.model );
              });
              it("creates a unique model without the 'cacheKey' property", function() {
                var instance1 = new wexInfiniteListService( delegate ),
                    instance2 = new wexInfiniteListService( delegate );

                expect( instance1.model ).not.toBe( instance2.model );
              })
              it("extends the instance's settings with properties provided", function () {
                  var options  = { pageSize: 10, currentPage: 10 },
                      instance = new wexInfiniteListService( delegate, options );

                  expect( instance.settings ).toEqual( options );
              });
          });
      });

      describe("has a loadNextPage function that", function () {
          var mockResponse;

          beforeEach(function () {
              mockResponse = [ {name: 'x'}, {name: 'y'}, {name: 'z'} ];
          });

          it("should send a message to delegate.makeRequest", function () {
              var instance = new wexInfiniteListService( delegate );

              instance.loadNextPage();
              expect( instance.delegate.makeRequest ).toHaveBeenCalled();
          });

          describe("if settings.isGreeking is false then the model.collection", function () {
              var settings, instance, mockModel;

              beforeEach(function() {
                  settings  = { pageSize: 3, isGreeking: false },
                  instance  = new wexInfiniteListService( delegate, settings );

                  Array.prototype.push.apply( instance.model.collection, mockItems );
              });

              it("should have had new items appended to it", function () {
                  var mockCollection = _.union( mockItems, mockResponse );

                  instance.loadNextPage();
                  deferred.resolve( mockResponse );
                  $scope.$apply();
                  expect( instance.model.collection ).toEqual( mockCollection );
              })
          });

          describe("if settings.isGreeking is true then the model.collection", function () {
              var settings, instance, mockModel;

              beforeEach(function() {
                  settings  = { pageSize: 3, isGreeking: true },
                  instance  = new wexInfiniteListService( delegate, settings );

                  Array.prototype.push.apply( instance.model.collection, mockItems );
              });

              it("should have had new items appended to it", function () {
                  var mockCollection = _.union( mockItems, mockResponse );

                  // mock completion of loaded data where items have isGreekLoading:false
                  _.each(mockResponse, function(item) {
                      item.isGreekLoading = false;
                  });

                  instance.loadNextPage();
                  deferred.resolve( mockResponse );
                  $scope.$apply();
                  expect( instance.model.collection ).toEqual( mockCollection );
              })
          });
      });

      describe("has a resetCollection function that", function () {
          var mockResponse = [ {name: 'x'}, {name: 'y'}, {name: 'z'} ];

          it("should reset properties 'settings.currentPage' and 'isLoadingComplete'", function () {
              var instance = new wexInfiniteListService( delegate );
              instance.isLoadingComplete    = true;
              instance.settings.currentPage = 10;

              instance.resetCollection();
              expect( instance.isLoadingComplete ).toBe( false );
              expect( instance.settings.currentPage ).toBe( 0 );
          });

          describe("if settings.isGreeking is false then the model.collection", function () {
              var settings, instance;

              beforeEach(function () {
                  settings = { pageSize: 3, isGreeking: false },
                  instance = new wexInfiniteListService( delegate, settings );
              });

              it("should remain populated with current items during delegate.makeRequest call", function () {
                  Array.prototype.push.apply( instance.model.collection, mockItems );

                  instance.resetCollection();
                  expect( instance.model.collection ).toEqual( mockItems );
              });
              it("should have been populated with new items once delegate.makeRequest has resolved", function () {
                  Array.prototype.push.apply( instance.model.collection, mockItems );

                  instance.resetCollection();
                  deferred.resolve( mockResponse );
                  $scope.$apply();
                  expect( instance.model.collection ).toEqual( mockResponse );
              });
          });

          describe("if settings.isGreeking is true then the model.collection", function () {
              var settings, instance, mockModel;

              beforeEach(function() {
                  settings  = { pageSize: 3, isGreeking: true },
                  instance  = new wexInfiniteListService( delegate, settings ),
                  mockModel = { isGreekLoading: true };
              });

              it("should be populated with 'isGreekLoading:true' objects equivalent to 'pageSize' during delegate.makeRequest call", function () {
                  Array.prototype.push.apply( instance.model.collection, mockItems );

                  instance.resetCollection();
                  expect( instance.model.collection ).toEqual([ mockModel, mockModel, mockModel ]);
              });
              it("should have the 'isGreekLoading:true' items replaced with new items containing 'isGreekLoading:false' once delegate.makeRequest has resolved", function () {
                  Array.prototype.push.apply( instance.model.collection, mockItems );

                  instance.resetCollection();
                  deferred.resolve( mockResponse );
                  $scope.$apply();

                  expect( instance.model.collection.length ).toEqual( mockResponse.length );

                  _.each(instance.model.collection, function(item) {
                      expect( item.isGreekLoading ).toBeDefined();
                      expect( item.isGreekLoading ).toBeFalsy();
                  });
              });
          });
      });

      describe("has a static emptyCache function that", function () {
          var instance1, instance2, instance3;

          beforeEach(function() {
            instance1 = new wexInfiniteListService( delegate, { cacheKey: 'foo' } ),
            instance2 = new wexInfiniteListService( delegate, { cacheKey: 'bar' } ),
            instance3 = new wexInfiniteListService( delegate, { cacheKey: 'baz' } );

            Array.prototype.push.apply( instance1.model.collection, mockItems );
            Array.prototype.push.apply( instance2.model.collection, mockItems );
            Array.prototype.push.apply( instance3.model.collection, mockItems );
          });

          it("should accept a single argument of 'cacheKey' to reset an instance's model.collection", function () {
              wexInfiniteListService.emptyCache( 'bar' );
              expect( instance1.model.collection ).toEqual( mockItems );
              expect( instance2.model.collection ).toEqual( [] );
              expect( instance3.model.collection ).toEqual( mockItems );
          });
          it("should accept a multiple arguments of 'cacheKey' to reset each instance's model.collection", function () {
              wexInfiniteListService.emptyCache( 'foo', 'baz' );
              expect( instance1.model.collection ).toEqual( [] );
              expect( instance2.model.collection ).toEqual( mockItems );
              expect( instance3.model.collection ).toEqual( [] );
          });
      });
    });
})();
