(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that takes in a reload callback that is called each time the user nears the end of the list, until all
     * data has been loaded. Example usage:
     *
     * <wex-infinite-list on-reload="loadNextPage" reload-distance="'5%'">
     *     <ion-item ng-repeat="item in items">
     *         ...
     *     </ion-item>
     * </wex-infinite-list>
     */

    /* @ngInject */
    function wexInfiniteList($q, CommonService) {
        var DEFAULT_RELOAD_DISTANCE = "1%",
            _ = CommonService._;

        var directive = {
            restrict   : "E",
            transclude : true,
            link       : link,
            templateUrl: "app/shared/widgets/templates/infiniteList.html",
            scope      : {
                onReload       : "=",
                onPageLoaded: "=",
                reloadDistance : "=?",
                loadingComplete: "&?"
            }
        };

        return directive;
        //////////////////////

        function loadMore() {
            var self = this;

            $q.when(self.loadingComplete() || self.onReload())
                .then(function (allDataLoaded) {
                    self.allDataLoaded = allDataLoaded;
                })
                .finally(function () {
                    self.onPageLoaded();
                    self.$broadcast("scroll.infiniteScrollComplete");
                });
        }

        function allDataLoaded() {
            return this.allDataLoaded;
        }

        function link(scope) { // args: scope, elem, attrs
            //scope objects:
            scope.reloadDistance = scope.reloadDistance || DEFAULT_RELOAD_DISTANCE;
            scope.loadingComplete = scope.loadingComplete || _.bind(allDataLoaded, scope);
            scope.allDataLoaded = false;

            scope.loadMore = _.bind(loadMore, scope);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexInfiniteList", wexInfiniteList);
})();
