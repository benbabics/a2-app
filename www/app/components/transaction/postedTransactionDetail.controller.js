(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:4

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
