(function () {
    "use strict";

    function WexInfiniteListController($scope, $attrs, _, wexInfiniteListService) {
      var serviceDelegate = {
              makeRequest:  handleMakeRequest,
              onError:      handleOnError,
              onResetItems: handleOnResetItems
          },
          settings = _.extend( _.pick($attrs, 'cacheKey'), $attrs.settings );


      /**
       * Private Methods
      **/
      function loadNextPage() {
          return $scope.infiniteScrollService.loadNextPage()
              .catch(function(errorResponse) {
                  serviceDelegate.onError( errorResponse );
              })
              .finally(function() {
                  $scope.$broadcast( 'scroll.refreshComplete' );
              });
      }

      function resetSearchResults() {
          serviceDelegate.onResetItems();
          $scope.infiniteScrollService.resetCollection();
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
      $scope.transactions          = $scope.infiniteScrollService.model.collection;

      $scope.loadNextPage       = loadNextPage;
      $scope.resetSearchResults = resetSearchResults;
    }


    angular
        .module("app.shared.widgets")
        .controller("WexInfiniteListController", WexInfiniteListController);
})();
