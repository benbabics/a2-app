(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function transactionResultAsDate() {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "app/components/transaction/templates/transactionResultAsDate.html",
            controller:  controller
        };

        function controller($scope) {
          $scope.isCard   = $scope.filterBy === "card";
          $scope.isDriver = $scope.filterBy === "driver";
        }
    }

    angular.module("app.components.transaction")
        .directive("transactionResultAsDate", transactionResultAsDate);
}());
