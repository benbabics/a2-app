(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function transactionResultAsDate() {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "app/components/transaction/templates/transactionResultAsDate.html",
            controller:  controller,
            link:        link
        };

        function controller($scope) {
            $scope.isCard   = $scope.filterBy === "card";
            $scope.isDriver = $scope.filterBy === "driver";
        }

        function link(scope, element, attrs) {
            var displayChevron = attrs.displayChevron === undefined ? true : attrs.displayChevron;
            scope.displayChevron = JSON.parse( displayChevron );
        }
    }

    angular.module("app.components.transaction")
        .directive("transactionResultAsDate", transactionResultAsDate);
}());
