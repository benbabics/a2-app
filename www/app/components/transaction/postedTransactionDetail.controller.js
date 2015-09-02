(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PostedTransactionDetailController($scope, globals, postedTransaction) {

        var vm = this;

        vm.config = globals.POSTED_TRANSACTION_DETAIL.CONFIG;

        vm.postedTransaction = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.postedTransaction = postedTransaction;
        }

    }

    angular.module("app.components.transaction")
        .controller("PostedTransactionDetailController", PostedTransactionDetailController);
})();