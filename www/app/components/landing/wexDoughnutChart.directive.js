(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that displays the donut chart. */

    /* @ngInject */
    function wexDoughnutChart(_) {
        var directive = {
            restrict: "E",
            replace: true,
            link: link,
            templateUrl: "app/components/landing/templates/wexDoughnutChart.directive.html"
        };

        function link (scope, element, attrs) {
            scope.chart = scope.$eval(attrs.chartConfig);
            scope.chart.width = _.round(window.innerWidth * .3);
        }
        return directive;
        //////////////////////

        // any functions are defined here and references are
        // made to these functions in the returned object

    }

    angular
        .module("app.components.landing")
        .directive("wexDoughnutChart", wexDoughnutChart);
})();
