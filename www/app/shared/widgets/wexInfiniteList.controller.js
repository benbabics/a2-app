(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    function WexInfiniteListController($scope, $attrs, $timeout, $ionicScrollDelegate, _, wexInfiniteListService) {
      var serviceDelegate = {
              makeRequest:      angular.noop,
              removeItem:       angular.noop,
              onError:          angular.noop,
              onResetItems:     angular.noop,
              onRenderComplete: angular.noop
          },
          settings = _.extend(
              _.pick( $attrs, "cacheKey", "isGreeking" ),                   // create new object of specific attrs
              $scope.$parent ? $scope.$parent.$eval( $attrs.settings ) : {} // evaluate any settings attr expressions
          );

      // check for isGreeking
      settings.isGreeking = settings.isGreeking === "true" || settings.isGreeking === true;

      // make props accesible for tests
      this.settings        = settings;
      this.serviceDelegate = serviceDelegate;

      // prevent clicking on greeking results prematurely
      if ( settings.isGreeking ) {
          $scope.$on("$stateChangeStart", function(evt, toState, toParams) {
              if ( toParams.isGreeking ) { evt.preventDefault(); }
          });
      }

      /**
       * Private Methods
      **/
      function respondToRequest(promise) {
          return promise
              .catch(function(errorResponse) {
                  serviceDelegate.onError( errorResponse );
              })
              .finally(function() {
                  $timeout(function() {
                      if ( settings.isGreeking ) {
                          $ionicScrollDelegate.resize(); // recalc rendered ion-items
                      }
                      serviceDelegate.onRenderComplete();
                      $scope.$broadcast( "scroll.refreshComplete" );
                  }, 100);
              });
      }

      function loadNextPage() {
          return respondToRequest( $scope.infiniteScrollService.loadNextPage() );
      }

      function resetSearchResults(options) {
          serviceDelegate.onResetItems();
          return respondToRequest( $scope.infiniteScrollService.resetCollection(options) );
      }

      function removeItem(model) {
          return $scope.infiniteScrollService.removeItem(model)
              .finally(function() {
                  if ( settings.isGreeking ) {
                    $ionicScrollDelegate.resize(); // recalc rendered ion-items
                  }

                  $scope.$broadcast( "scroll.refreshComplete" );
              });
      }

      /**
       * Public Methods
      **/
      this.assignServiceDelegate = function(delegate) {
          _.extend( serviceDelegate, delegate );
      };

      /**
       * Expose Properties
      **/
      $scope.infiniteScrollService = new wexInfiniteListService( serviceDelegate, settings );
      $scope.loadNextPage          = loadNextPage;
      $scope.resetSearchResults    = resetSearchResults;
      $scope.removeItem            = removeItem;
    }


    angular
        .module("app.shared.widgets")
        .controller("WexInfiniteListController", WexInfiniteListController);
})();
