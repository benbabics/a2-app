(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexColoredCurrency(_) {
        //Private members
        var directiveElem,
            vm;

        //Public members
        var directive = {
            restrict: "A",
            link    : link,
            scope   : {
                model: "=ngModel"
            }
        };

        function setClass() {
            if (_.isNumber(vm.model)) {
                if (vm.model > 0) {
                    directiveElem.addClass("balance-positive");
                }
                else {
                    directiveElem.addClass("balance-negative");
                }
            }
        }

        function link(scope, elem) {
            vm = scope;
            directiveElem = elem;

            //functions
            scope.setClass = _.bind(setClass, scope, _);

            //watchers
            scope.$watch(scope.model, scope.setClass);
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexColoredCurrency", wexColoredCurrency);
}());
