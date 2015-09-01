(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function TransactionListController($scope, globals) {

        var vm = this;

        vm.config = globals.TRANSACTION_LIST.CONFIG;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();