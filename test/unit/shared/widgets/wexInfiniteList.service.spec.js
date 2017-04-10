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
          mockItems = [ {name: 'a'}, {name: 'b'}, {name: 'c'} ];
          delegate  = { makeRequest: function() {}, onRequestItems: function() {} };

          inject(function (___, _$rootScope_, _$q_, _wexInfiniteListService_) {
              _                      = ___;
              $q                     = _$q_;
              $scope                 = _$rootScope_.$new();
              deferred               = $q.defer();
              wexInfiniteListService = _wexInfiniteListService_;

              spyOn( delegate, "makeRequest" ).and.returnValue( deferred.promise ); // expecting a promise
              spyOn( delegate, "onRequestItems" );
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

              it("creates a unique model", function() {
                var instance1 = new wexInfiniteListService( delegate ),
                    instance2 = new wexInfiniteListService( delegate );

                expect( instance1.model ).not.toBe( instance2.model );
              });

              it("extends the instance's settings with properties provided", function () {
                  var options  = { pageSize: 10, currentPage: 10 },
                      instance = new wexInfiniteListService( delegate, options );

                  expect( instance.settings ).toEqual( options );
              });
          });
      });

      describe("has a loadNextPage function that", function () {
          var instance, mockResponse;

          beforeEach(function () {
              mockResponse = [ {name: 'x'}, {name: 'y'}, {name: 'z'} ];
              instance = new wexInfiniteListService( delegate );
              instance.loadNextPage();
          });

          it("should send a message to delegate.onRequestItems to handle pre-response rendering", function () {
              expect( instance.delegate.onRequestItems ).toHaveBeenCalled();
          });

          it("should send a message to delegate.makeRequest", function () {
              expect( instance.delegate.makeRequest ).toHaveBeenCalled();
          });

          describe("updates isLoadingComplete value that", () => {
              var instance, len;

              function initAndLoadNextPage(defaults={}, totalResults) {
                  let settings = _.extend( { isGreeking: true }, defaults );
                  instance = new wexInfiniteListService( delegate, settings );

                  len = mockResponse.length;
                  if ( totalResults ) { mockResponse.totalResults = totalResults; }

                  instance.loadNextPage();
                  deferred.resolve( mockResponse );
                  $scope.$apply();
              }

              describe("when response.data.totalResults is undefined", () => {
                  it("should be assigned false when pageSize is EQ to response length", () => {
                      initAndLoadNextPage({ pageSize: len });
                      expect( instance.isLoadingComplete ).toBe( false );
                  });

                  it("should be assigned false when pageSize is LT response length", () => {
                      initAndLoadNextPage({ pageSize: len - 1 });
                      expect( instance.isLoadingComplete ).toBe( false );
                  });

                  it("should be assigned true when pageSize is GT response length", () => {
                      initAndLoadNextPage({ pageSize: 25 });
                      expect( instance.isLoadingComplete ).toBe( true );
                  });
              });

              describe("when response.data.totalResults is defined", () => {
                  it("should be assigned true when totalResults is EQ to response length", () => {
                      initAndLoadNextPage( {}, len );
                      expect( instance.isLoadingComplete ).toBe( true );
                  });

                  it("should be assigned false when totalResults is LT response length", () => {
                      initAndLoadNextPage( {}, len - 1 );
                      expect( instance.isLoadingComplete ).toBe( false );
                  });

                  it("should be assigned false when totalResults is GT response length", () => {
                      initAndLoadNextPage( {}, len + 1 );
                      expect( instance.isLoadingComplete ).toBe( false );
                  });
              });
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
              it("should not be populated with 'isGreekLoading:false' if an argument with the hash { skipGreeking: true } was present", function() {
                Array.prototype.push.apply( instance.model.collection, mockItems );

                instance.resetCollection({ skipGreeking: true });
                expect( instance.model.collection ).toEqual( mockItems );

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
    });
})();
