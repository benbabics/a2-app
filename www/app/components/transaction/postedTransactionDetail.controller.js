(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function PostedTransactionDetailController($cordovaGoogleAnalytics, $scope, globals, postedTransaction, CommonService) {

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

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

    }

    angular.module("app.components.transaction")
        .controller("PostedTransactionDetailController", PostedTransactionDetailController);
})();
