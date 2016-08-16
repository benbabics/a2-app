(function () {
    "use strict";

    function WexInfiniteListController($scope, $attrs, $ionicScrollDelegate, _, wexInfiniteListService) {
      var serviceDelegate = {
              makeRequest:      angular.noop,
              removeItem:       angular.noop,
              onError:          angular.noop,
              onResetItems:     angular.noop,
              onRenderComplete: angular.noop
          },
          settings = _.extend(
              _.pick( $attrs, 'cacheKey', 'isGreeking' ),                   // create new object of specific attrs
              $scope.$parent ? $scope.$parent.$eval( $attrs.settings ) : {} // evaluate any settings attr expressions
          );

      // check for isGreeking
      settings.isGreeking = settings.isGreeking === 'true' || settings.isGreeking === true;

      // make props accesible for tests
      this.settings        = settings;
      this.serviceDelegate = serviceDelegate;

      /**
       * Private Methods
      **/
      function loadNextPage() {
          return $scope.infiniteScrollService.loadNextPage()
              .catch(function(errorResponse) {
                  serviceDelegate.onError( errorResponse );
              })
              .finally(function() {
                  if ( settings.isGreeking ) {
                    $ionicScrollDelegate.resize(); // recalc rendered ion-items
                  }

                  serviceDelegate.onRenderComplete();
                  $scope.$broadcast( 'scroll.refreshComplete' );
              });
      }

      function removeItem(model) {
          return $scope.infiniteScrollService.removeItem(model)
              .finally(function() {
                  if ( settings.isGreeking ) {
                    $ionicScrollDelegate.resize(); // recalc rendered ion-items
                  }

                  $scope.$broadcast( 'scroll.refreshComplete' );
              });
      }

      function resetSearchResults(options) {
          serviceDelegate.onResetItems();
          // settings.isGreeking may be enabled, but allow for the ability to
          // reset the collection without greeking.
          return $scope.infiniteScrollService.resetCollection(options).finally(function() {
              serviceDelegate.onRenderComplete();
          });
      }

      /**
       * Public Methods
      **/
      this.assignServiceDelegate = function(delegate) {
          _.extend( serviceDelegate, delegate );
      }

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
