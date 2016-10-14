(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexRefresher(_, globals) {
        var directive = {
            restrict: "AC",
            compile : _.constant({pre: pre})
        };

        return directive;
        //////////////////////

        function pre(scope) { //arguments: scope, elem, attrs
            //apply default arguments to the ion-refresher element
            angular.extend(scope, globals.PULL_TO_REFRESH);
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexRefresher", wexRefresher);
})();
