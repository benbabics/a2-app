(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexToastTimer(_, $interval) {
        var DEFAULT_TIMEOUT = 3000; //ms

        var directive = {
            restrict: "A",
            link    : link
        };

        return directive;

        function link(scope, elem, attrs) {
            var timeout = _.toNumber(scope.$eval(attrs.wexToastTimer) || DEFAULT_TIMEOUT),
                onHideFn = attrs.wexToastOnHide;

            //start the toast timer if the element is not currently hidden
            scope.$watch(function () {
                return elem.hasClass("hide");
            }, function (hidden) {
                if (!hidden) {
                    startTimer();
                }
            });

            //Private functions:
            function startTimer() {
                $interval(function () {
                    elem.addClass("hide");

                    if (onHideFn) {
                        scope.$eval(onHideFn);
                    }
                }, timeout, 1);
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexToastTimer", wexToastTimer);
})();
