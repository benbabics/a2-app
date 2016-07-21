(function () {
    "use strict";

    function WexInfiniteListController($scope, $attrs, $ionicScrollDelegate, _, wexInfiniteListService) {
      var serviceDelegate = {
              makeRequest:  handleMakeRequest,
              onError:      handleOnError,
              onResetItems: handleOnResetItems
          },
          settings = _.extend( _.pick($attrs, 'cacheKey', 'isGreeking'), $attrs.settings );

      // check for isGreeking
      settings.isGreeking = settings.isGreeking === 'true' || settings.isGreeking === true;


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
                    $ionicScrollDelegate.resize();
                  }

                  $scope.$broadcast( 'scroll.refreshComplete' );
              });
      }

      function resetSearchResults() {
          serviceDelegate.onResetItems();
          return $scope.infiniteScrollService.resetCollection();
      }


      /**
       * Public Methods
      **/
      this.assignServiceDelegate = function(delegate) {
          _.extend( serviceDelegate, delegate );
      }


      /**
       * Abstract Methods
      **/
      function handleMakeRequest() {}
      function handleOnError() {}
      function handleOnResetItems() {}


      /**
       * Expose Properties
      **/
      $scope.infiniteScrollService = new wexInfiniteListService( serviceDelegate, settings );
      $scope.loadNextPage          = loadNextPage;
      $scope.resetSearchResults    = resetSearchResults;
    }


    angular
        .module("app.shared.widgets")
        .controller("WexInfiniteListController", WexInfiniteListController);
})();
